import { useRouter } from "next/router";

export const useDataTableSorting = (columnName: string) => {
  const router = useRouter();

  const handleClick = () => {
    const currentSort = router.query[columnName] as string | undefined;
    let newSort: string;

    if (currentSort === "asc") {
      newSort = "desc";
    } else {
      newSort = "asc";
    }

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [columnName]: newSort,
      },
    });
  };

  return {
    handleClick,
    isSorted: router.query[columnName],
  };
};
