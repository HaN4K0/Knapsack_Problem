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

      const capacity = Number(lines[0].trim());
      const items = [];

      for (let i = 1; i < lines.length; i++) {
        // Loại bỏ các khoảng trắng thừa giữa các giá trị
        const parts = lines[i].trim().split(/\s+/); // Sử dụng regex \s+ để tách bằng khoảng trắng
        const value = Number(parts[0]);
        const weight = Number(parts[1]);
        // Chỉ sử dụng quantity cho CBL2
        const quantity = selectedBackpack === "CBL2" ? Number(parts[2]) : 1;

        // Kiểm tra dữ liệu đầu vào hợp lệ
        if (
          !isNaN(value) &&
          !isNaN(weight) &&
          value > 0 &&
          weight > 0 &&
          quantity > 0
        ) {
          items.push({ value, weight, quantity });
        } else {
          alert(`Dòng ${i + 1} không hợp lệ. Vui lòng kiểm tra lại file.`);
          return;
        }
      }

      // Lưu dữ liệu và tạo bảng hiển thị
      document.getElementById("capacityInput").value = capacity;
      displayTable(selectedBackpack, items);
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

// Nút tính toán
document
  .getElementById("calculateButton")
  .addEventListener("click", function () {
    const selectedBackpack = document.getElementById("backpackSelect").value;
    if (selectedBackpack === "CBL1") {
      calculateGreedyAlgorithmCBL1(); // Xử lý cho CBL1
    } else if (selectedBackpack === "CBL2") {
      calculateGreedyAlgorithmCBL2(); // Xử lý cho CBL2
    } else if (selectedBackpack === "CBL3") {
      calculateGreedyAlgorithmCBL3(); // Xử lý cho CBL3
    } else {
      alert("Vui lòng chọn loại balo.");
    }
  });

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
  if (!capacity || !numOfItems || capacity <= 0 || numOfItems <= 0) {
    alert("Vui lòng nhập dung lượng balo và số lượng món đồ hợp lệ.");
    return;
  }

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

// Hàm tính toán thuật toán tham lam cho Knapsack CBL1 (Cơ bản)
function calculateGreedyAlgorithmCBL1() {
  const capacity = Number(document.getElementById("capacityInput").value); // Dung lượng balo
  const valueInputs = document.querySelectorAll(".value-input"); // Các ô nhập giá trị
  const weightInputs = document.querySelectorAll(".weight-input"); // Các ô nhập trọng lượng

  const items = []; // Mảng chứa các món đồ
  for (let i = 0; i < valueInputs.length; i++) {
    const value = Number(valueInputs[i].value); // Giá trị của món đồ
    const weight = Number(weightInputs[i].value); // Trọng lượng của món đồ

    if (value > 0 && weight > 0) {
      items.push({ value, weight, ratio: value / weight, index: i }); // Tính tỷ lệ giá trị/trọng lượng và thêm chỉ số vào món đồ
    } else {
      alert(`Vui lòng nhập giá trị và trọng lượng hợp lệ cho đồ ${i + 1}.`);
      return;
    }
  }

  // Sắp xếp các món đồ theo tỷ lệ giá trị/trọng lượng giảm dần
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0; // Tổng giá trị
  let totalWeight = 0; // Tổng trọng lượng
  let remainingCapacity = capacity; // Dung lượng còn lại của balo
  const selectedItems = [0, 0, 0, 0]; // Mảng lưu số lượng từng món đồ được chọn

  // Lặp qua các món đồ và chọn từng món theo tỷ lệ giá trị/trọng lượng
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Chọn bao nhiêu món đồ có thể trong giới hạn dung lượng còn lại của balo
    if (remainingCapacity >= item.weight) {
      const count = Math.floor(remainingCapacity / item.weight); // Số lượng món đồ có thể chọn
      selectedItems[i] = count; // Lưu số lượng món đồ được chọn
      totalValue += count * item.value; // Cộng giá trị của các món đồ đã chọn
      totalWeight += count * item.weight; // Cộng trọng lượng của các món đồ đã chọn
      remainingCapacity -= count * item.weight; // Giảm dung lượng balo còn lại
    }
  }

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = ` 
  <h4>Kết quả</h4>
  <p>Tổng giá trị tối đa: <strong>${totalValue}</strong></p>
  <p>Tổng trọng lượng đã chọn: <strong>${totalWeight}</strong></p>
  <p>Trọng lượng còn lại của balo: <strong>${remainingCapacity}</strong></p>
  <p>Các món đồ được chọn:</p>
  <ul>
    ${selectedItems
      .map((count, index) =>
        count > 0
          ? `<li>Đồ ${items[index].index + 1}: Số lượng = ${count}, Giá trị = ${
              items[index].value
            }, Trọng lượng = ${items[index].weight}</li>`
          : ""
      )
      .join("")}
  </ul>
`;
}

// Hàm tính toán cho Knapsack CBL2 (Giới hạn số lượng)
function calculateGreedyAlgorithmCBL2() {
  const capacity = Number(document.getElementById("capacityInput").value); // Dung lượng balo
  const valueInputs = document.querySelectorAll(".value-input"); // Các ô nhập giá trị
  const weightInputs = document.querySelectorAll(".weight-input"); // Các ô nhập trọng lượng
  const quantityInputs = document.querySelectorAll(".quantity-input"); // Các ô nhập số lượng

  const items = []; // Mảng chứa các món đồ
  for (let i = 0; i < valueInputs.length; i++) {
    const value = Number(valueInputs[i].value); // Giá trị của món đồ
    const weight = Number(weightInputs[i].value); // Trọng lượng của món đồ
    const quantity = Number(quantityInputs[i].value); // Số lượng của món đồ

    if (value > 0 && weight > 0 && quantity > 0) {
      items.push({
        value,
        weight,
        quantity,
        ratio: value / weight,
        index: i,
      }); // Tính tỷ lệ giá trị/trọng lượng và thêm chỉ số vào món đồ
    } else {
      alert(
        `Vui lòng nhập giá trị, trọng lượng và số lượng hợp lệ cho đồ ${i + 1}.`
      );
      return;
    }
  }

  // Sắp xếp các món đồ theo tỷ lệ giá trị/trọng lượng giảm dần
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0; // Tổng giá trị
  let totalWeight = 0; // Tổng trọng lượng
  let remainingCapacity = capacity; // Dung lượng còn lại của balo
  const selectedItems = [0, 0, 0]; // Mảng lưu số lượng từng món đồ được chọn

  // Lặp qua các món đồ và chọn từng món theo tỷ lệ giá trị/trọng lượng
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Chọn bao nhiêu món đồ có thể trong giới hạn dung lượng còn lại của balo
    if (remainingCapacity >= item.weight && item.quantity > 0) {
      const count = Math.min(
        Math.floor(remainingCapacity / item.weight),
        item.quantity
      ); // Số lượng món đồ có thể chọn
      selectedItems[i] = count; // Lưu số lượng món đồ được chọn
      totalValue += count * item.value; // Cộng giá trị của các món đồ đã chọn
      totalWeight += count * item.weight; // Cộng trọng lượng của các món đồ đã chọn
      remainingCapacity -= count * item.weight; // Giảm dung lượng balo còn lại
    }
  }

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = ` 
  <h4>Kết quả</h4>
  <p>Tổng giá trị tối đa: <strong>${totalValue}</strong></p>
  <p>Tổng trọng lượng đã chọn: <strong>${totalWeight}</strong></p>
  <p>Trọng lượng còn lại của balo: <strong>${remainingCapacity}</strong></p>
  <p>Các món đồ được chọn:</p>
  <ul>
    ${selectedItems
      .map((count, index) =>
        count > 0
          ? `<li>Đồ ${items[index].index + 1}: Số lượng = ${count}, Giá trị = ${
              items[index].value
            }, Trọng lượng = ${items[index].weight}</li>`
          : ""
      )
      .join("")}
  </ul>
`;
}

// Hàm tính toán cho Knapsack CBL3 (0/1) sử dụng thuật toán tham lam
function calculateGreedyAlgorithmCBL3() {
  const capacity = Number(document.getElementById("capacityInput").value); // Dung lượng balo
  const valueInputs = document.querySelectorAll(".value-input"); // Các ô nhập giá trị
  const weightInputs = document.querySelectorAll(".weight-input"); // Các ô nhập trọng lượng

  const items = []; // Mảng chứa các món đồ
  for (let i = 0; i < valueInputs.length; i++) {
    const value = Number(valueInputs[i].value); // Giá trị của món đồ
    const weight = Number(weightInputs[i].value); // Trọng lượng của món đồ

    if (value > 0 && weight > 0) {
      items.push({ value, weight, ratio: value / weight, index: i }); // Tính tỷ lệ giá trị/trọng lượng và thêm chỉ số vào món đồ
    } else {
      alert(`Vui lòng nhập giá trị và trọng lượng hợp lệ cho đồ ${i + 1}.`);
      return;
    }
  }

  // Sắp xếp các món đồ theo tỷ lệ giá trị/trọng lượng giảm dần
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0; // Tổng giá trị
  let totalWeight = 0; // Tổng trọng lượng
  let remainingCapacity = capacity; // Dung lượng còn lại của balo
  const selectedItems = new Array(items.length).fill(0); // Khởi tạo mảng lưu số lượng từng món đồ được chọn

  // Lặp qua các món đồ và chọn từng món theo tỷ lệ giá trị/trọng lượng
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Kiểm tra nếu món đồ có thể được chọn (với điều kiện 0/1, chỉ chọn 1 lần)
    if (remainingCapacity >= item.weight) {
      selectedItems[item.index] = 1; // Đánh dấu là đã chọn món đồ
      totalValue += item.value; // Cộng giá trị của món đồ đã chọn
      totalWeight += item.weight; // Cộng trọng lượng của món đồ đã chọn
      remainingCapacity -= item.weight; // Giảm dung lượng balo còn lại
    }
  }

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = ` 
  <h4>Kết quả</h4>
  <p>Tổng giá trị tối đa: <strong>${totalValue}</strong></p>
  <p>Tổng trọng lượng đã chọn: <strong>${totalWeight}</strong></p>
  <p>Trọng lượng còn lại của balo: <strong>${remainingCapacity}</strong></p>
  <p>Các món đồ được chọn:</p>
  <ul>
    ${selectedItems
      .map((isSelected, index) =>
        isSelected > 0
          ? `<li>Đồ ${index + 1}: Giá trị = ${
              items.find((item) => item.index === index).value
            }, Trọng lượng = ${
              items.find((item) => item.index === index).weight
            }</li>`
          : ""
      )
      .join("")}
  </ul>
`;
}
