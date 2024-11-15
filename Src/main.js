// Hàm kiểm tra đầu vào (Validation)
function validateInputs(items, capacity) {
  if (isNaN(capacity) || capacity <= 0) {
    alert("Vui lòng nhập sức chứa balo hợp lệ (lớn hơn 0).");
    return false;
  }

  for (const item of items) {
    if (item.weight <= 0 || item.value <= 0) {
      alert("Trọng lượng và giá trị của mỗi đồ vật phải lớn hơn 0.");
      return false;
    }
  }
  return true;
}

// Giải CBL1 - Không giới hạn số lượng (Greedy Algorithm) và hiển thị kết quả
function solveGreedyKnapsack(items, capacity) {
  items.sort((a, b) => b.value / b.weight - a.value / a.weight);
  let totalValue = 0;
  const selectedItems = [];

  for (const item of items) {
    if (capacity <= 0) break;
    const maxQuantity = Math.floor(capacity / item.weight);
    if (maxQuantity > 0) {
      selectedItems.push({
        name: item.name,
        weight: item.weight,
        value: item.value,
        quantity: maxQuantity,
      });
      totalValue += maxQuantity * item.value;
      capacity -= maxQuantity * item.weight;
    }
  }

  return { totalValue, selectedItems };
}

// Giải CBL2 - Giới hạn số lượng (Branch and Bound)
function solveLimitedKnapsack(items, capacity) {
  let totalValue = 0;
  const selectedItems = [];
  items.sort((a, b) => b.value / b.weight - a.value / a.weight);

  for (const item of items) {
    const count = Math.min(Math.floor(capacity / item.weight), item.quantity);
    if (count > 0) {
      selectedItems.push({
        name: item.name,
        weight: item.weight,
        value: item.value,
        quantity: count,
      });
      totalValue += count * item.value;
      capacity -= count * item.weight;
    }
    if (capacity <= 0) break;
  }

  return { totalValue, selectedItems };
}

// Giải CBL3 - 0/1 Knapsack (Dynamic Programming)
function solveKnapsack01(weights, values, capacity, items) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const selectedItems = [];

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push({
        name: items[i - 1].name,
        weight: items[i - 1].weight,
        value: items[i - 1].value,
        quantity: 1,
      });
      w -= weights[i - 1];
    }
  }

  return { totalValue: dp[n][capacity], selectedItems };
}

// Hàm chính để giải bài toán
function solveKnapsack() {
  const capacity = parseInt(document.getElementById("capacity").value);
  const problemType = document.getElementById("problem-type").value;
  const itemsContainer = document.querySelectorAll(".item");
  const items = Array.from(itemsContainer).map((item, index) => ({
    name: `Đồ vật ${index + 1}`,
    weight: parseFloat(item.children[0].value),
    value: parseFloat(item.children[1].value),
    quantity: parseInt(item.children[2].value) || Infinity,
  }));

  if (!validateInputs(items, capacity)) return;

  let result, solution;
  const weights = items.map((item) => item.weight);
  const values = items.map((item) => item.value);

  if (problemType === "CBL1") {
    solution = solveGreedyKnapsack(items, capacity);
  } else if (problemType === "CBL2") {
    solution = solveLimitedKnapsack(items, capacity);
  } else if (problemType === "CBL3") {
    solution = solveKnapsack01(weights, values, capacity, items);
  }

  result = solution.totalValue;
  const selectedItems = solution.selectedItems;

  // Hiển thị kết quả
  document.getElementById("result").textContent = `Giá trị tối ưu: ${result}`;

  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "<h3>Danh sách đồ vật đã chọn:</h3>";
  selectedItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = `${item.name}: Số lượng ${item.quantity}, Trọng lượng ${item.weight}, Giá trị ${item.value}`;
    resultContainer.appendChild(itemDiv);
  });
}

// Event listeners
document
  .getElementById("solve-knapsack")
  .addEventListener("click", solveKnapsack);
document.getElementById("add-item").addEventListener("click", () => {
  const newItem = document.createElement("div");
  newItem.classList.add("item");
  newItem.innerHTML = `<input type="number" placeholder="Trọng lượng" min="1">
                         <input type="number" placeholder="Giá trị" min="1">
                         <input type="number" placeholder="Số lượng (CBL2)" min="0">`;
  document.getElementById("items-container").appendChild(newItem);
});
