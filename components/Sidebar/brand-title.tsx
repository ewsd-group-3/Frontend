import Image from "next/image";
import PlaceHolderImg from "@/public/placeholder-img.png";

export default function BrandTitle() {
  return (
    <div className='flex items-center gap-x-4'>
      <Image
        src={PlaceHolderImg}
        className='rounded-full'
        width={40}
        height={40}
        alt='logo'
      />
      <h1 className='text-white origin-left font-medium text-md'>
        Wyne School Portal
      </h1>
    </div>
  );
}
