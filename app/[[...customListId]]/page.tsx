import Script from "next/script";

import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import BeerCard from "../_components/BeerCard";

const { CLIENT_ID, CLIENT_SECRET, DEFAULT_PAGE_TITLE, MY_LIST_ID } =
  process.env;

async function getData(
  listId?: string,
  previousResult?: CustomListResponse,
  offset = 0
) {
  const res = await fetch(
    `https://api.untappd.com/v4/custom_lists/view/${
      listId ?? MY_LIST_ID
    }?limit=50&offset=${offset}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  );

  if (!res.ok) {
    console.error(res.status, res.statusText);
    return getData();
  }

  const result = await res.json();
  if (result.response.pagination.offset) {
    return getData(listId, result, offset + 50);
  }

  const out = result;
  if (previousResult) {
    out.response.items.unshift(...previousResult.response.items);
    out.response.count = out.response.total_count;
  }

  return out;
}

export async function generateMetadata({
  params,
}: {
  params: { customListId: string };
}) {
  const { customListId } = params;
  const {
    response: {
      // @ts-ignore
      list,
    },
  }: { response: CustomListResponse } = await getData(
    customListId ? customListId[0] : undefined
  );

  return {
    title: `${DEFAULT_PAGE_TITLE} (${list.list_name})`,
  };
}

export default async function Home({
  params,
}: {
  params: { customListId: string };
}) {
  const { customListId } = params;
  const {
    response: { items },
  }: { response: { items: ListItem[] } } = await getData(
    customListId ? customListId[0] : undefined
  );

  return (
    <>
      {process.env.NODE_ENV === "production" && (
        <Script
          async
          src="https://umami.israndom.win/script.js"
          data-website-id="7bcd3494-17e7-42b4-bb1e-c22c95fbb63d"
        ></Script>
      )}

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: 900,
            my: 5,
            "@media (max-width: 800px)": { maxWidth: 400 },
          }}
        >
          {/* Stats */}
          {/* <Grid xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid xs={3}>
                  <Countries items={items} />
                </Grid>
                <Grid xs={3}>
                  <Alcohol items={items} />
                </Grid>
                <Grid xs={6}>
                  <Popularity items={items} />
                </Grid>
              </Grid>
            </Paper>
          </Grid> */}
          {items.map((item: ListItem) => (
            <BeerCard
              key={item.item_id}
              customListId={customListId ? customListId[0] : MY_LIST_ID}
              item={item}
            />
          ))}
        </Grid>
      </Box>
    </>
  );
}
