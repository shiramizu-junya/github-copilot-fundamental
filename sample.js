// ショッピングカートの合計金額を計算する関数
function calculateTotal(items) {
	let total = 0;

	for (let i = 0; i < items.length; i++) {
		// ✅ 修正: i < items.length
		total += items[i].price * items[i].quantity;
	}

	return total;
}

// テスト
const cart = [
	{ name: 'Apple', price: 100, quantity: 3 },
	{ name: 'Banana', price: 50, quantity: 5 },
	{ name: 'Orange', price: 80, quantity: 2 },
];

console.log(calculateTotal(cart)); // エラー: Cannot read property 'price' of undefined
