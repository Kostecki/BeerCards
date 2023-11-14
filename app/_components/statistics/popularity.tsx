import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";

export default function Popularity({ items }: { items: ListItem[] }) {
  const mostRated = () => {
    return "Balls";
  };

  const highestRated = () => {
    return "Other Balls";
  };

  return (
    <Grid container spacing={0}>
      <Grid xs={12} sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: "light" }}>
          Popularitet
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={6}>Grid</Grid>
        <Grid xs={6}>Grid</Grid>
      </Grid>
    </Grid>
  );
}
