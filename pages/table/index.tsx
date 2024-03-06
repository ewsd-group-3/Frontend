import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable/data-table";

export default function DemoPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/table");
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container mx-auto py-10'>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
