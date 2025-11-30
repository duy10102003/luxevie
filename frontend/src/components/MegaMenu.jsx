import { Link } from 'react-router-dom';

const categories = [
  { slug: 'ao', name: 'ÁO' },
  { slug: 'quan', name: 'QUẦN' },
  { slug: 'phu-kien', name: 'PHỤ KIỆN' },
];

export default function MegaMenu() {
  return (
    <div className="flex items-center gap-1">
      {categories.map((category) => (
        <Link
          key={category.slug}
          to={`/${category.slug}`}
          className="px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
