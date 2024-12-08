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
        calculateBABCBL1(uploadedCapacity, uploadedItems); // CBL1
      } else if (selectedBackpack === "CBL2") {
        calculateBABCBL2(uploadedCapacity, uploadedItems); // CBL2
      } else if (selectedBackpack === "CBL3") {
        calculateBABCBL3(uploadedCapacity, uploadedItems); // CBL3
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
        calculateBABCBL1(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else if (selectedBackpack === "CBL2") {
        calculateBABCBL2(
          Number(document.getElementById("capacityInput").value),
          getManualInputItems()
        );
      } else if (selectedBackpack === "CBL3") {
        calculateBABCBL3(
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

// Hàm tính toán thuật toán BAB cho CBL1
function calculateBABCBL1(capacity, items) {
  // Sắp xếp đồ vật theo tỷ lệ giá trị/trọng lượng giảm dần
  const sortedItems = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight
  );

  let bestValue = 0; // Giá trị tối ưu
  let bestCombination = Array(items.length).fill(0); // Danh sách đồ vật được chọn

  // Hàm tính cận trên
  function calculateUpperBound(index, remainingCapacity, currentValue) {
    let bound = currentValue;
    let remainingWeight = remainingCapacity;

    for (let i = index; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      if (item.weight <= remainingWeight) {
        bound += item.value;
        remainingWeight -= item.weight;
      } else {
        bound += (remainingWeight / item.weight) * item.value;
        break;
      }
    }

    return bound;
  }

  // Hàng đợi duyệt các trạng thái
  const queue = [];
  queue.push({
    index: 0,
    remainingCapacity: capacity,
    currentValue: 0,
    combination: Array(items.length).fill(0),
  });

  // Duyệt qua hàng đợi
  while (queue.length > 0) {
    const currentNode = queue.pop();
    const { index, remainingCapacity, currentValue, combination } = currentNode;

    // Cập nhật giá trị tối ưu
    if (currentValue > bestValue) {
      bestValue = currentValue;
      bestCombination = [...combination];
    }

    // Nếu đã duyệt hết đồ vật hoặc hết trọng lượng, bỏ qua
    if (index >= sortedItems.length || remainingCapacity <= 0) {
      continue;
    }

    // Tính cận trên
    const upperBound = calculateUpperBound(
      index,
      remainingCapacity,
      currentValue
    );

    // Nếu cận trên không tốt hơn giá trị tốt nhất, cắt tỉa
    if (upperBound <= bestValue) {
      continue;
    }

    // Lấy đồ vật hiện tại
    const currentItem = sortedItems[index];
    const maxQuantity = Math.floor(remainingCapacity / currentItem.weight);

    // Nhánh 1: Chọn tối đa số lượng món đồ hiện tại
    for (let q = maxQuantity; q >= 1; q--) {
      const newCombination = [...combination];
      newCombination[items.indexOf(currentItem)] += q;
      queue.push({
        index: index + 1,
        remainingCapacity: remainingCapacity - q * currentItem.weight,
        currentValue: currentValue + q * currentItem.value,
        combination: newCombination,
      });
    }

    // Nhánh 2: Không chọn đồ vật hiện tại
    queue.push({
      index: index + 1,
      remainingCapacity,
      currentValue,
      combination,
    });

    // Sắp xếp hàng đợi theo cận trên giảm dần
    queue.sort(
      (a, b) =>
        calculateUpperBound(b.index, b.remainingCapacity, b.currentValue) -
        calculateUpperBound(a.index, a.remainingCapacity, a.currentValue)
    );
  }

  // Tính tổng trọng lượng đã chọn
  const totalWeight = bestCombination.reduce(
    (sum, count, idx) => sum + count * items[idx].weight,
    0
  );

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
    <h4>Kết quả</h4>
    <p>Tổng giá trị tối đa: <strong>${bestValue}</strong></p>
    <p>Tổng trọng lượng đồ vật: <strong>${totalWeight}</strong></p>
    <p>Trọng lượng còn lại của balo: <strong>${
      capacity - totalWeight
    }</strong></p>
    <p>Các món đồ được chọn:</p>
    <ul>
      ${bestCombination
        .map((count, idx) =>
          count > 0
            ? `<li>Đồ ${idx + 1}: Số lượng = ${count}, Giá trị = ${
                items[idx].value
              }, Trọng lượng = ${items[idx].weight}</li>`
            : ""
        )
        .join("")}
    </ul>
  `;
}

// Hàm tính toán thuật toán BAB cho CBL2
function calculateBABCBL2(capacity, items) {
  // Sắp xếp đồ vật theo tỷ lệ giá trị/trọng lượng giảm dần
  const sortedItems = [...items]
    .map((item, index) => ({ ...item, originalIndex: index }))
    .sort((a, b) => b.value / b.weight - a.value / a.weight);

  let bestValue = 0; // Giá trị tối ưu
  let bestCombination = Array(items.length).fill(0); // Danh sách đồ vật được chọn

  // Hàm tính cận trên
  function calculateUpperBound(index, remainingCapacity, currentValue) {
    let bound = currentValue;
    let remainingWeight = remainingCapacity;

    for (let i = index; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      if (item.weight <= remainingWeight) {
        const maxQuantity = Math.min(
          Math.floor(remainingWeight / item.weight),
          item.quantity
        );
        bound += maxQuantity * item.value;
        remainingWeight -= maxQuantity * item.weight;
      } else {
        bound += (remainingWeight / item.weight) * item.value;
        break;
      }
    }

    return bound;
  }

  // Hàng đợi duyệt các trạng thái
  const queue = [];
  queue.push({
    index: 0,
    remainingCapacity: capacity,
    currentValue: 0,
    combination: Array(items.length).fill(0),
  });

  // Duyệt qua hàng đợi
  while (queue.length > 0) {
    const currentNode = queue.pop();
    const { index, remainingCapacity, currentValue, combination } = currentNode;

    // Cập nhật giá trị tối ưu
    if (currentValue > bestValue) {
      bestValue = currentValue;
      bestCombination = [...combination];
    }

    // Nếu đã duyệt hết đồ vật hoặc hết trọng lượng, bỏ qua
    if (index >= sortedItems.length || remainingCapacity <= 0) {
      continue;
    }

    // Tính cận trên
    const upperBound = calculateUpperBound(
      index,
      remainingCapacity,
      currentValue
    );

    // Nếu cận trên không tốt hơn giá trị tốt nhất, cắt tỉa
    if (upperBound <= bestValue) {
      continue;
    }

    // Lấy đồ vật hiện tại
    const currentItem = sortedItems[index];
    const maxQuantity = Math.min(
      Math.floor(remainingCapacity / currentItem.weight),
      currentItem.quantity
    );

    // Nhánh 1: Chọn 1 đến maxQuantity món đồ vật hiện tại
    for (let q = maxQuantity; q >= 1; q--) {
      const newCombination = [...combination];
      newCombination[index] += q;
      queue.push({
        index: index + 1,
        remainingCapacity: remainingCapacity - q * currentItem.weight,
        currentValue: currentValue + q * currentItem.value,
        combination: newCombination,
      });
    }

    // Nhánh 2: Không chọn đồ vật hiện tại
    queue.push({
      index: index + 1,
      remainingCapacity,
      currentValue,
      combination,
    });

    // Sắp xếp hàng đợi theo cận trên giảm dần
    queue.sort(
      (a, b) =>
        calculateUpperBound(b.index, b.remainingCapacity, b.currentValue) -
        calculateUpperBound(a.index, a.remainingCapacity, a.currentValue)
    );
  }

  // Tính tổng trọng lượng đã chọn
  const totalWeight = bestCombination.reduce(
    (sum, count, idx) => sum + count * sortedItems[idx].weight,
    0
  );

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
  <h4>Kết quả</h4>
  <p>Tổng giá trị tối đa: <strong>${bestValue}</strong></p>
  <p>Tổng trọng lượng đồ vật: <strong>${totalWeight}</strong></p>
  <p>Trọng lượng còn lại của balo: <strong>${
    capacity - totalWeight
  }</strong></p>
  <p>Các món đồ được chọn:</p>
  <ul>
    ${items
      .map((_, originalIdx) => {
        const sortedIdx = sortedItems.findIndex(
          (item) => item.originalIndex === originalIdx
        );
        const count = bestCombination[sortedIdx];
        return count > 0
          ? `<li>Đồ ${originalIdx + 1}: Số lượng = ${count}, Giá trị = ${
              items[originalIdx].value
            }, Trọng lượng = ${items[originalIdx].weight}</li>`
          : "";
      })
      .join("")}
  </ul>
`;
}

// Hàm tính toán thuật toán BAB cho CBL3
function calculateBABCBL3(capacity, items) {
  // Lưu danh sách gốc để hiển thị giá trị và trọng lượng chính xác
  const originalItems = [...items];

  // Sắp xếp đồ vật theo tỷ lệ giá trị/trọng lượng giảm dần
  const sortedItems = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight
  );

  let bestValue = 0; // Giá trị tối ưu
  let bestCombination = Array(items.length).fill(0); // Mảng lưu số lượng đồ vật được chọn

  // Hàm tính cận trên tại một nút
  function calculateUpperBound(index, remainingCapacity, currentValue) {
    let bound = currentValue;
    let remainingWeight = remainingCapacity;

    // Tính giá trị tối đa có thể có khi lấy đồ vật tiếp theo
    for (let i = index; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      if (item.weight <= remainingWeight) {
        bound += item.value;
        remainingWeight -= item.weight;
      } else {
        break; // Không lấy đồ vật một phần trong bài toán này (CBL3)
      }
    }

    return bound;
  }

  // Hàng đợi duyệt các trạng thái
  const queue = [];
  queue.push({
    index: 0,
    remainingCapacity: capacity,
    currentValue: 0,
    combination: Array(items.length).fill(0),
  });

  // Duyệt qua hàng đợi
  while (queue.length > 0) {
    const currentNode = queue.pop();
    const { index, remainingCapacity, currentValue, combination } = currentNode;

    // Cập nhật giá trị tốt nhất nếu cần
    if (currentValue > bestValue) {
      bestValue = currentValue;
      bestCombination = [...combination];
    }

    // Nếu đã duyệt hết đồ vật hoặc không còn dung lượng, bỏ qua
    if (index >= sortedItems.length || remainingCapacity <= 0) {
      continue;
    }

    // Tính cận trên của nhánh hiện tại
    const upperBound = calculateUpperBound(
      index,
      remainingCapacity,
      currentValue
    );

    // Nếu cận trên không tốt hơn giá trị tốt nhất, cắt tỉa
    if (upperBound <= bestValue) {
      continue;
    }

    // Lấy đồ vật hiện tại
    const currentItem = sortedItems[index];

    // Nhánh 1: Chọn đồ vật hiện tại
    if (currentItem.weight <= remainingCapacity) {
      const newCombination = [...combination];
      newCombination[index] = 1; // Đánh dấu món đồ đã chọn
      queue.push({
        index: index + 1,
        remainingCapacity: remainingCapacity - currentItem.weight,
        currentValue: currentValue + currentItem.value,
        combination: newCombination,
      });
    }

    // Nhánh 2: Không chọn đồ vật hiện tại
    queue.push({
      index: index + 1,
      remainingCapacity,
      currentValue,
      combination,
    });

    // Sắp xếp lại hàng đợi theo cận trên giảm dần
    queue.sort(
      (a, b) =>
        calculateUpperBound(b.index, b.remainingCapacity, b.currentValue) -
        calculateUpperBound(a.index, a.remainingCapacity, a.currentValue)
    );
  }

  // Tính tổng trọng lượng đã chọn
  const totalWeight = bestCombination.reduce(
    (sum, count, idx) => sum + count * sortedItems[idx].weight,
    0
  );

  // Hiển thị kết quả
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `
    <h4>Kết quả</h4>
    <p>Tổng giá trị tối đa: <strong>${bestValue}</strong></p>
    <p>Tổng trọng lượng đồ vật: <strong>${totalWeight}</strong></p>
    <p>Trọng lượng còn lại của balo: <strong>${
      capacity - totalWeight
    }</strong></p>
    <p>Các món đồ được chọn:</p>
    <ul>
      ${bestCombination
        .map((count, idx) =>
          count > 0
            ? `<li>Đồ ${originalItems[idx].index}: Số lượng = ${count}, Giá trị = ${originalItems[idx].value}, Trọng lượng = ${originalItems[idx].weight}</li>`
            : ""
        )
        .join("")}
    </ul>
  `;
}
