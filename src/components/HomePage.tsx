import Clock from './Clock';
import SearchBar from './SearchBar';
import QuickLinks from './QuickLinks';

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-8">
        <Clock />
        <SearchBar />
        <QuickLinks />
      </div>
    </div>
  );
}
