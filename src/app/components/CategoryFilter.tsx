const categories = [
  'All',
  'Fashion',
  'Tech',
  'Food',
  'Agriculture',
  'Beauty',
  'Services',
  'Art'
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 max-w-6xl mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category
                ? 'primary-bg text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
