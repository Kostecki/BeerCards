import { Box, Typography } from "@mui/material";

export default function Countries({ items }: { items: ListItem[] }) {
  // @ts-ignore
  const ranking: {
    name: string;
    count: number;
  }[] = Object.values(
    items.reduce((acc, { brewery: { country_name } }) => {
      acc[country_name as keyof typeof acc] = acc[
        country_name as keyof typeof acc
      ] || {
        name: country_name,
        count: 0,
      };
      acc[country_name as keyof typeof acc]["count"]++;

      return acc;
    }, {})
  ).sort((a: any, b: any) => b.count - a.count);

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: "light" }}>
        Favoritlande
      </Typography>
      {ranking.map((country) => {
        const { name, count } = country;
        return (
          <Typography key={name}>
            {name} ({count})
          </Typography>
        );
      })}
    </>
  );
}
