import { Box, Typography } from "@mui/material";

export default function Alcohol({ items }: { items: ListItem[] }) {
  let low = items[0].beer.beer_abv;
  let high = items[0].beer.beer_abv;
  let abvs: number[] = [];

  items.forEach((item) => {
    const abv = item.beer.beer_abv;

    if (abv < low) {
      low = abv;
    }

    if (abv > high) {
      high = abv;
    }

    abvs.push(abv);
  });

  const avg = (array: number[]) => {
    return array.reduce((a, b) => a + b, 0) / array.length;
  };

  const toFixedLocal = (number: number) => {
    return number.toLocaleString("da", {
      maximumFractionDigits: 2,
    });
  };
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: "light" }}>
        Alkohol
      </Typography>
      <Box>
        <Typography>Højeste: {toFixedLocal(high)} %</Typography>
        <Typography>Laveste: {toFixedLocal(low)} %</Typography>
        <Typography>Gennemsnit: {toFixedLocal(avg(abvs))} %</Typography>
      </Box>
    </>
  );
}
