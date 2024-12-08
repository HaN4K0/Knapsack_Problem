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
const fileInput = document.getElementById("fileInput");

// Thêm sự kiện cho nút "Tạo Dữ Liệu Mới"
// resetButton.addEventListener("click", () => {
//   // Xóa dữ liệu trong các input
//   capacityInput.value = "";
//   itemsCountInput.value = "";
//   fileInput.value = "";

//   // Xóa nội dung bảng
//   itemsTableContainer.innerHTML = "";

//   // Ẩn kết quả tính toán
//   resultContainer.style.display = "none";

//   // Thông báo người dùng
//   // alert("Dữ liệu đã được đặt lại. Bạn có thể nhập mới từ đầu.");

//   //Đặt lại dữ liệu tải lên
//   uploadedItems = [];
//   uploadedCapacity = 0;
// });

// //Điểu chỉnh nút reset
// resetButton.addEventListener("click", () => {
//   // Đặt lại biến toàn cục
//   uploadedItems = [];
//   uploadedCapacity = 0;

//   // Xóa nội dung các input
//   capacityInput.value = "";
//   itemsCountInput.value = "";
//   fileInput.value = "";
//   document.getElementById("backpackSelect").value = ""; // Đặt lại loại balo

//   // Xóa nội dung bảng và kết quả
//   itemsTableContainer.innerHTML = "";
//   resultContainer.innerHTML = "";
//   resultContainer.style.display = "none";

//   // Hiển thị thông báo cho người dùng
//   alert("Dữ liệu đã được reset. Vui lòng nhập dữ liệu mới hoặc tải file.");
// });

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
        calculateGreedyAlgorithmCBL1(uploadedCapacity, uploadedItems); // CBL1
      } else if (selectedBackpack === "CBL2") {
        calculateGreedyAlgorithmCBL2(uploadedCapacity, uploadedItems); // CBL2
      } else if (selectedBackpack === "CBL3") {
        calculateGreedyAlgorithmCBL3(uploadedCapacity, uploadedItems); // CBL3
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
        calculateGreedyAlgorithmCBL1(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else if (selectedBackpack === "CBL2") {
        calculateGreedyAlgorithmCBL2(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else if (selectedBackpack === "CBL3") {
        calculateGreedyAlgorithmCBL3(
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

// Hàm tính toán thuật toán tham lam cho CBL1
function calculateGreedyAlgorithmCBL1(capacity, items) {
  // Sắp xếp các món đồ theo tỷ lệ giá trị/trọng lượng giảm dần
  const sortedItems = [...items]
    .map((item, index) => ({
      ...item,
      ratio: item.value / item.weight,
      index: index + 1, // Lưu lại chỉ số của món đồ
    }))
    .sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let totalWeight = 0;
  let remainingCapacity = capacity;
  const selectedItems = new Array(items.length).fill(0); // Mảng lưu số lượng từng món đồ được chọn

  // Lặp qua các món đồ và chọn từng món theo tỷ lệ giá trị/trọng lượng
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];

    if (remainingCapacity >= item.weight) {
      const count = Math.floor(remainingCapacity / item.weight);
      selectedItems[item.index - 1] = count; // Lưu số lượng món đồ được chọn vào đúng chỉ số ban đầu
      totalValue += count * item.value;
      totalWeight += count * item.weight;
      remainingCapacity -= count * item.weight;
    }
  }

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
    <h4>Kết quả</h4>
    <p>Tổng giá trị tối đa: <strong>${totalValue}</strong></p>
    <p>Tổng trọng lượng đồ vật: <strong>${totalWeight}</strong></p>
    <p>Trọng lượng còn lại của balo: <strong>${remainingCapacity}</strong></p>
    <p>Các món đồ được chọn:</p>
    <ul>
      ${selectedItems
        .map((count, index) =>
          count > 0
            ? `<li>Đồ ${index + 1}: Số lượng = ${count}, Giá trị = ${
                items[index].value
              }, Trọng lượng = ${items[index].weight}</li>`
            : ""
        )
        .join("")}
    </ul>
  `;
}

// Hàm tính toán thuật toán tham lam cho CBL2 (Knapsack with limited quantities)
function calculateGreedyAlgorithmCBL2(capacity, items) {
  // Sắp xếp các món đồ theo tỷ lệ giá trị/trọng lượng giảm dần
  const sortedItems = [...items]
    .map((item, index) => ({
      ...item,
      ratio: item.value / item.weight,
      index: index + 1, // Lưu lại chỉ số của món đồ
    }))
    .sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let totalWeight = 0;
  let remainingCapacity = capacity;
  const selectedItems = new Array(items.length).fill(0); // Mảng lưu số lượng từng món đồ được chọn

  // Lặp qua các món đồ và chọn từng món theo tỷ lệ giá trị/trọng lượng
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];

    // Kiểm tra nếu có thể chọn món đồ này
    const count = Math.min(
      Math.floor(remainingCapacity / item.weight),
      item.quantity
    );
    selectedItems[item.index - 1] = count; // Lưu số lượng món đồ được chọn vào đúng chỉ số ban đầu
    totalValue += count * item.value;
    totalWeight += count * item.weight;
    remainingCapacity -= count * item.weight;
  }

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
    <h4>Kết quả</h4>
    <p>Tổng giá trị tối đa: <strong>${totalValue}</strong></p>
    <p>Tổng trọng lượng đồ vật: <strong>${totalWeight}</strong></p>
    <p>Trọng lượng còn lại của balo: <strong>${remainingCapacity}</strong></p>
    <p>Các món đồ được chọn:</p>
    <ul>
      ${selectedItems
        .map((count, index) =>
          count > 0
            ? `<li>Đồ ${index + 1}: Số lượng = ${count}, Giá trị = ${
                items[index].value
              }, Trọng lượng = ${items[index].weight}</li>`
            : ""
        )
        .join("")}
    </ul>
  `;
}

// Hàm tính toán thuật toán tham lam cho CBL3 (0/1 Knapsack)
function calculateGreedyAlgorithmCBL3(capacity, items) {
  // Sắp xếp các món đồ theo tỷ lệ giá trị/trọng lượng giảm dần
  const sortedItems = [...items]
    .map((item, index) => ({
      ...item,
      ratio: item.value / item.weight,
      index: index + 1, // Lưu lại chỉ số của món đồ
    }))
    .sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let totalWeight = 0;
  let remainingCapacity = capacity;
  const selectedItems = new Array(items.length).fill(0); // Mảng lưu số lượng từng món đồ được chọn

  // Lặp qua các món đồ và chọn từng món theo tỷ lệ giá trị/trọng lượng
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];

    // Chọn món đồ này nếu còn đủ dung lượng
    if (remainingCapacity >= item.weight) {
      selectedItems[item.index - 1] = 1; // Chỉ chọn 1 món đồ
      totalValue += item.value;
      totalWeight += item.weight;
      remainingCapacity -= item.weight;
    }
  }

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
    <h4>Kết quả</h4>
    <p>Tổng giá trị tối đa: <strong>${totalValue}</strong></p>
    <p>Tổng trọng lượng đồ vật: <strong>${totalWeight}</strong></p>
    <p>Trọng lượng còn lại của balo: <strong>${remainingCapacity}</strong></p>
    <p>Các món đồ được chọn:</p>
    <ul>
      ${selectedItems
        .map((count, index) =>
          count > 0
            ? `<li>Đồ ${index + 1}: Giá trị = ${
                items[index].value
              }, Trọng lượng = ${items[index].weight}</li>`
            : ""
        )
        .join("")}
    </ul>
  `;
}
