// Biến toàn cục lưu trữ dữ liệu đã tải lên từ file
let uploadedItems = [];
let uploadedCapacity = 0;

// Nút tải file
document
  .getElementById("loadFileButton")
  .addEventListener("click", function () {
    const selectedBackpack = document.getElementById("backpackSelect").value;
    if (!selectedBackpack) {
      alert("Vui lòng chọn loại balo trước.");
      return;
    }

    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
      alert("Vui lòng chọn một file có đuôi .txt.");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const content = event.target.result;
      const lines = content.trim().split("\n");

      uploadedCapacity = Number(lines[0].trim());
      uploadedItems = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);
        const value = Number(parts[0]);
        const weight = Number(parts[1]);
        const quantity = selectedBackpack === "CBL2" ? Number(parts[2]) : 1;

        if (
          !isNaN(value) &&
          !isNaN(weight) &&
          value > 0 &&
          weight > 0 &&
          quantity > 0
        ) {
          uploadedItems.push({ value, weight, quantity });
        } else {
          alert(`Dòng ${i + 1} không hợp lệ. Vui lòng kiểm tra lại file.`);
          return;
        }
      }

      document.getElementById("capacityInput").value = uploadedCapacity;
      displayTable(selectedBackpack, uploadedItems);
    };

    reader.readAsText(file);
  });

// Hàm tạo bảng hiển thị dữ liệu từ file
function displayTable(problemType, items) {
  const tableContainer = document.getElementById("itemsTableContainer");
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className = "table table-bordered table-striped";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Tên món đồ", "Giá trị", "Trọng lượng"].forEach((headerText) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Thêm cột "Số lượng" cho CBL2
  if (problemType === "CBL2") {
    const quantityHeader = document.createElement("th");
    quantityHeader.textContent = "Số lượng";
    headerRow.appendChild(quantityHeader);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  items.forEach((item, index) => {
    const row = document.createElement("tr");

    const itemNameCell = document.createElement("td");
    itemNameCell.textContent = `Đồ ${index + 1}`;
    row.appendChild(itemNameCell);

    const valueCell = document.createElement("td");
    valueCell.textContent = item.value;
    row.appendChild(valueCell);

    const weightCell = document.createElement("td");
    weightCell.textContent = item.weight;
    row.appendChild(weightCell);

    // Hiển thị cột "Số lượng" cho CBL2
    if (problemType === "CBL2") {
      const quantityCell = document.createElement("td");
      quantityCell.textContent = item.quantity;
      row.appendChild(quantityCell);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

// Lấy tham chiếu đến các thành phần giao diện
const resetButton = document.getElementById("resetButton");
const capacityInput = document.getElementById("capacityInput");
const itemsCountInput = document.getElementById("itemsCountInput");
const itemsTableContainer = document.getElementById("itemsTableContainer");
const resultContainer = document.getElementById("resultContainer");

// Nút tính toán
document
  .getElementById("calculateButton")
  .addEventListener("click", function () {
    const selectedBackpack = document.getElementById("backpackSelect").value;

    if (!selectedBackpack) {
      alert("Vui lòng chọn loại balo trước khi tính toán.");
      return;
    }

    // Kiểm tra dữ liệu từ form nhập tay
    const valueInputs = document.querySelectorAll(".value-input");
    const weightInputs = document.querySelectorAll(".weight-input");

    // Nếu có dữ liệu từ file đã tải lên
    if (uploadedItems.length > 0) {
      if (selectedBackpack === "CBL1") {
        calculateDPCBL1(uploadedCapacity, uploadedItems); // CBL1
      } else if (selectedBackpack === "CBL2") {
        calculateDPCBL2(uploadedCapacity, uploadedItems); // CBL2
      } else if (selectedBackpack === "CBL3") {
        calculateDPCBL3(uploadedCapacity, uploadedItems); // CBL3
      } else {
        alert("Vui lòng chọn loại balo.");
      }
    }
    // Nếu không có dữ liệu từ file, kiểm tra dữ liệu từ form nhập tay
    else if (valueInputs.length > 0 && weightInputs.length > 0) {
      // Kiểm tra các ô input giá trị và trọng lượng
      let isValid = true;
      for (let i = 0; i < valueInputs.length; i++) {
        const value = Number(valueInputs[i].value);
        const weight = Number(weightInputs[i].value);

        // Kiểm tra giá trị hợp lệ
        if (isNaN(value) || isNaN(weight) || value <= 0 || weight <= 0) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        alert("Vui lòng nhập dữ liệu hợp lệ cho tất cả các món đồ.");
        return;
      }

      // Gọi hàm tính toán tương ứng với loại balo đã chọn
      if (selectedBackpack === "CBL1") {
        calculateDPCBL1(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else if (selectedBackpack === "CBL2") {
        calculateDPCBL2(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else if (selectedBackpack === "CBL3") {
        calculateDPCBL3(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else {
        alert("Vui lòng chọn loại balo.");
      }
    } else {
      alert("Vui lòng nhập dữ liệu hoặc tải file trước khi tính toán.");
    }
  });

// Hàm lấy dữ liệu từ form nhập tay
function getManualInputItems() {
  const valueInputs = document.querySelectorAll(".value-input");
  const weightInputs = document.querySelectorAll(".weight-input");
  const quantityInputs = document.querySelectorAll(".quantity-input");

  const items = [];
  for (let i = 0; i < valueInputs.length; i++) {
    const value = Number(valueInputs[i].value);
    const weight = Number(weightInputs[i].value);
    const quantity =
      quantityInputs.length > 0 ? Number(quantityInputs[i].value) : 1;

    if (value > 0 && weight > 0 && quantity > 0) {
      items.push({
        value: value,
        weight: weight,
        quantity: quantity,
      });
    }
  }

  return items;
}

// Gán sự kiện cho nút tạo bảng
document
  .getElementById("generateTableButton")
  .addEventListener("click", function () {
    const selectedBackpack = document.getElementById("backpackSelect").value;
    if (!selectedBackpack) {
      alert("Vui lòng chọn loại balo trước.");
      return;
    }
    createTable(selectedBackpack);
  });

// Hàm tạo bảng các món đồ
function createTable(problemType) {
  const capacity = document.getElementById("capacityInput").value;
  const numOfItems = document.getElementById("itemsCountInput").value;

  // Kiểm tra giá trị nhập vào
  if (!capacity || !numOfItems) {
    alert("Vui lòng nhập trọng lượng balo và số lượng món đồ ít nhất là 1.");
    return;
  }

  // Đặt lại dữ liệu cũ
  uploadedItems = [];
  uploadedCapacity = 0;

  // Tạo bảng
  const tableContainer = document.getElementById("itemsTableContainer");
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className = "table table-bordered table-striped";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Tên món đồ", "Giá trị", "Trọng lượng"].forEach((headerText) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Thêm cột "Số lượng" cho CBL2
  if (problemType === "CBL2") {
    const quantityHeader = document.createElement("th");
    quantityHeader.textContent = "Số lượng";
    headerRow.appendChild(quantityHeader);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let i = 0; i < numOfItems; i++) {
    const row = document.createElement("tr");

    const itemNameCell = document.createElement("td");
    itemNameCell.textContent = `Đồ ${i + 1}`;
    row.appendChild(itemNameCell);

    const valueCell = document.createElement("td");
    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.className = "form-control value-input";
    valueInput.placeholder = "Nhập giá trị";
    row.appendChild(valueCell).appendChild(valueInput);

    const weightCell = document.createElement("td");
    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.className = "form-control weight-input";
    weightInput.placeholder = "Nhập trọng lượng";
    row.appendChild(weightCell).appendChild(weightInput);

    // Thêm cột "Số lượng" cho CBL2
    if (problemType === "CBL2") {
      const quantityCell = document.createElement("td");
      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.className = "form-control quantity-input";
      row.appendChild(quantityCell).appendChild(quantityInput);
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

// Hàm tính toán thuật toán DP cho CBL1
function calculateDPCBL1(capacity, items) {
  const n = items.length;

  // Tạo bảng DP và bảng lưu số lượng đồ vật
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));
  const count = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Lặp qua từng món đồ
  for (let i = 1; i <= n; i++) {
    const { value, weight } = items[i - 1]; // Đồ vật thứ i
    for (let W = 0; W <= capacity; W++) {
      dp[i][W] = dp[i - 1][W]; // Không chọn đồ vật i
      count[i][W] = 0;

      if (weight <= W) {
        const maxCount = Math.floor(W / weight);
        for (let x = 1; x <= maxCount; x++) {
          const newValue = dp[i - 1][W - x * weight] + x * value;
          if (newValue > dp[i][W]) {
            dp[i][W] = newValue;
            count[i][W] = x;
          }
        }
      }
    }
  }

  // Truy ngược lại để tìm các món đồ được chọn
  let remainingCapacity = capacity;
  const selectedItems = [];

  for (let i = n; i > 0; i--) {
    const x = count[i][remainingCapacity];
    if (x > 0) {
      selectedItems.push({
        index: i,
        value: items[i - 1].value,
        weight: items[i - 1].weight,
        quantity: x,
      });
      remainingCapacity -= x * items[i - 1].weight;
    }
  }

  // Sắp xếp lại danh sách món đồ theo thứ tự ban đầu
  selectedItems.sort((a, b) => a.index - b.index);

  const totalValue = dp[n][capacity];
  const totalWeight = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.weight,
    0
  );

  const result = {
    totalValue: totalValue,
    totalWeight: totalWeight,
    selectedItems: selectedItems,
    dpTable: dp,
  };

  // Hiển thị bảng DP
  const tableContainer = document.getElementById("dpTableContainer");
  let tableHTML = '<table border="1"><tr><th>i/W</th>';

  // Header cột
  for (let W = 0; W <= capacity; W++) {
    tableHTML += `<th>${W}<br>GT|SL</br></th> `;
  }
  tableHTML += "</tr>";

  for (let i = 1; i <= n; i++) {
    tableHTML += `<tr><td>Món ${i}</td>`;
    for (let W = 0; W <= capacity; W++) {
      tableHTML += `<td>${dp[i][W]} | ${count[i][W]} </td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  tableContainer.innerHTML = tableHTML;

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
      <h4>Kết quả</h4>
      <p>Tổng giá trị tối đa: <strong>${result.totalValue}</strong></p>
      <p>Tổng trọng lượng đồ vật: <strong>${result.totalWeight}</strong></p>
      <p>Trọng lượng còn lại của balo: <strong>${
        capacity - result.totalWeight
      }</strong></p>
      <p>Các món đồ được chọn:</p>
      <ul>
        ${result.selectedItems
          .map(
            (item) =>
              `<li>Món ${item.index}: Số lượng = ${item.quantity}, Giá trị = ${item.value}, Trọng lượng = ${item.weight}</li>`
          )
          .join("")}
      </ul>
    `;
}

// Hàm tính toán thuật toán DP cho CBL2
function calculateDPCBL2(capacity, items) {
  const n = items.length;
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));
  const count = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Lặp qua từng món đồ
  for (let i = 1; i <= n; i++) {
    const { value, weight, quantity } = items[i - 1]; // Món đồ thứ i
    for (let W = 0; W <= capacity; W++) {
      dp[i][W] = dp[i - 1][W]; // Không chọn món đồ i
      count[i][W] = 0;

      for (let x = 1; x <= Math.min(Math.floor(W / weight), quantity); x++) {
        const newValue = dp[i - 1][W - x * weight] + x * value;
        if (newValue > dp[i][W]) {
          dp[i][W] = newValue;
          count[i][W] = x;
        }
      }
    }
  }

  // Truy ngược lại để tìm các món đồ được chọn
  let remainingCapacity = capacity;
  const selectedItems = [];

  for (let i = n; i > 0; i--) {
    const x = count[i][remainingCapacity];
    if (x > 0) {
      selectedItems.push({
        index: i,
        value: items[i - 1].value,
        weight: items[i - 1].weight,
        quantity: x,
      });
      remainingCapacity -= x * items[i - 1].weight;
    }
  }

  // Sắp xếp lại danh sách món đồ theo thứ tự ban đầu
  selectedItems.sort((a, b) => a.index - b.index);

  const totalValue = dp[n][capacity];
  const totalWeight = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.weight,
    0
  );

  const result = {
    totalValue: totalValue,
    totalWeight: totalWeight,
    selectedItems: selectedItems,
    dpTable: dp,
  };

  // Hiển thị bảng DP
  const tableContainer = document.getElementById("dpTableContainer");
  let tableHTML = '<table border="1"><tr><th>i/W</th>';
  // Header cột
  for (let W = 0; W <= capacity; W++) {
    tableHTML += `<th>${W}<br>GT|SL</br></th>`;
  }
  tableHTML += "</tr>";

  for (let i = 1; i <= n; i++) {
    tableHTML += `<tr><td>Món ${i}</td>`;
    for (let W = 0; W <= capacity; W++) {
      // Hiển thị SL và GT
      tableHTML += `<td>${dp[i][W]} | ${count[i][W]}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  tableContainer.innerHTML = tableHTML;

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
      <h4>Kết quả</h4>
      <p>Tổng giá trị tối đa: <strong>${result.totalValue}</strong></p>
      <p>Tổng trọng lượng đồ vật: <strong>${result.totalWeight}</strong></p>
      <p>Trọng lượng còn lại của balo: <strong>${
        capacity - result.totalWeight
      }</strong></p>
      <p>Các món đồ được chọn:</p>
      <ul>
        ${result.selectedItems
          .map(
            (item) =>
              `<li>Món ${item.index}: Số lượng = ${item.quantity}, Giá trị = ${item.value}, Trọng lượng = ${item.weight}</li>`
          )
          .join("")}
      </ul>
    `;
}

// Hàm tính toán thuật toán DP cho CBL3
function calculateDPCBL3(capacity, items) {
  // Tạo bảng DP với (n + 1) dòng và (capacity + 1) cột
  const n = items.length;
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Lặp qua từng món đồ
  for (let i = 1; i <= n; i++) {
    const { value, weight } = items[i - 1]; // Đồ vật thứ i (số bắt đầu từ 1)

    // Lặp qua các trọng lượng từ 0 đến capacity
    for (let W = 0; W <= capacity; W++) {
      if (weight > W) {
        // Nếu món đồ quá nặng không thể thêm vào balo
        dp[i][W] = dp[i - 1][W];
      } else {
        // Chọn giữa việc không chọn món đồ hoặc chọn món đồ này
        dp[i][W] = Math.max(dp[i - 1][W], dp[i - 1][W - weight] + value);
      }
    }
  }

  // Truy ngược lại để tìm ra các món đồ được chọn
  let remainingCapacity = capacity;
  let selectedItems = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
      // Nếu giá trị thay đổi thì món đồ này được chọn
      selectedItems.push({
        index: i,
        value: items[i - 1].value,
        weight: items[i - 1].weight,
      });
      remainingCapacity -= items[i - 1].weight;
    }
  }

  // Sắp xếp lại danh sách món đồ được chọn theo thứ tự ban đầu
  selectedItems.sort((a, b) => a.index - b.index);

  // Trả về kết quả
  const totalValue = dp[n][capacity];
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

  const result = {
    totalValue: totalValue,
    totalWeight: totalWeight,
    selectedItems: selectedItems,
    dpTable: dp, // Bao gồm bảng DP để hiển thị
  };

  // Hiển thị bảng DP
  const tableContainer = document.getElementById("dpTableContainer");
  let tableHTML = '<table border="1"><tr><th>i/W</th>';
  // Header cột

  for (let W = 0; W <= capacity; W++) {
    tableHTML += `<th>${W}</th>`;
  }
  tableHTML += "</tr>";

  // Cột các dòng của bảng DP
  for (let i = 0; i <= n; i++) {
    tableHTML += `<tr><td>Món ${i}</td>`;
    for (let W = 0; W <= capacity; W++) {
      tableHTML += `<td>${dp[i][W]}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  tableContainer.innerHTML = tableHTML;

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
      <h4>Kết quả</h4>
      <p>Tổng giá trị tối đa: <strong>${result.totalValue}</strong></p>
      <p>Tổng trọng lượng đồ vật: <strong>${result.totalWeight}</strong></p>
      <p>Trọng lượng còn lại của balo: <strong>${
        capacity - result.totalWeight
      }</strong></p>
      <p>Các món đồ được chọn:</p>
      <ul>
        ${result.selectedItems
          .map(
            (item) =>
              `<li>Món ${item.index}: Giá trị = ${item.value}, Trọng lượng = ${item.weight}</li>`
          )
          .join("")}
      </ul>
    `;
}
