export default async function PopularStocksPage() {
  const res = await fetch("/api/popular-stocks", { cache: "no-store" })
;

  const stocks = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Popular Stocks
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Stocks people are checking out the most today
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocks.map(stock => (
          <div
            key={stock.ticker}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {stock.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {stock.ticker}
                </p>
              </div>

              <span
                className={`text-sm font-semibold ${
                  stock.change >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change}%
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                ${stock.price}
              </span>
              <span className="text-gray-400">
                👀 {stock.watchers.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
