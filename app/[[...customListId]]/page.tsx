import Script from "next/script";
import Image from "next/image";
import Link from "next/link";

import Grid from "@mui/material/Unstable_Grid2";
import { Box, Paper, Typography } from "@mui/material";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import * as countries from "@/app/countries.json";

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
    throw new Error("Failed to fetch data");
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

  const countryToFlag = (name: string) => {
    let country = name;

    // 🤷‍♂️
    if (country === "England") {
      country = "United Kingdom";
    }

    return Object.keys(countries)
      .find(
        // @ts-ignore
        (key) => countries[key] === country
      )
      ?.toLowerCase();
  };
  const getFlags = (mainCountry: string, collabs?: any) => {
    const flags = new Set();

    flags.add(countryToFlag(mainCountry));
    if (collabs) {
      collabs.items.forEach((brewery: any) => {
        const { country_name: name, brewery_id: id } = brewery.brewery;
        flags.add(countryToFlag(name));
      });
    }

    return flags;
  };
  const showABVIBU = (abv: number, ibu?: number) => {
    let output = `${abv.toLocaleString("da")}%`;
    if (ibu) {
      output += `, ${ibu} IBU`;
    }

    return output;
  };
  const truncateRating = (rating: number) => Math.trunc(rating * 100) / 100;

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
        <Grid container spacing={3} sx={{ maxWidth: 900, my: 5 }}>
          {items.map((item: ListItem) => (
            <Grid xs={12} lg={6} key={item.beer.bid} sx={{ display: "flex" }}>
              <Paper sx={{ p: 2, width: "100%" }}>
                <Box sx={{ textAlign: "center" }}>
                  {/* Image */}
                  <Box
                    sx={{
                      height: 100,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundImage: `url(${
                        !item.beer.beer_label.includes("badge-beer-default")
                          ? item.beer.beer_label
                          : "/badge-beer-default.png"
                      })`,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
                    {item.beer.beer_name}
                  </Typography>
                  {/* Brewery */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        fontSize: "1.15rem",
                        lineHeight: 1.5,
                        mb: 1,
                      }}
                    >
                      {item.brewery.brewery_name}{" "}
                    </Typography>
                    <Box sx={{ "span:not(:last-of-type)": { marginRight: 1 } }}>
                      {Array.from(getFlags(item.brewery.country_name)).map(
                        (flag, index) => (
                          <Box
                            component="span"
                            key={index}
                            sx={{
                              width: "45px !important",
                              lineHeight: "2rem !important",
                              borderRadius: "5px",
                            }}
                            className={`fi fi-${flag}`}
                          />
                        )
                      )}
                    </Box>
                  </Box>
                  {/* Specs */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontStyle: "italic",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                      pb: 1,
                      my: 2,
                    }}
                  >
                    {/* Left */}
                    <Box>
                      <Typography sx={{ fontWeight: 400 }}>
                        {item.beer.beer_style}
                      </Typography>
                    </Box>
                    {/* Right */}
                    <Box sx={{ display: "flex", whiteSpace: "pre-wrap" }}>
                      {/* ABV/IBU */}
                      <Typography sx={{ fontWeight: 400 }}>
                        {showABVIBU(item.beer.beer_abv, item.beer.beer_ibu)}
                      </Typography>
                      <Box sx={{ ml: 1, mt: "2px" }}>
                        <Link
                          href={`https://untappd.com/b/${item.beer.beer_slug}/${item.beer.bid}`}
                          target="_blank"
                        >
                          <Box
                            sx={{
                              ":hover": {
                                opacity: 0.8,
                              },
                              ":active": {
                                transform: "translateY(1px)",
                              },
                            }}
                          >
                            <Image
                              src="/untappd.png"
                              alt="Untappd Link"
                              width="18"
                              height="18"
                              style={{ marginRight: 8 }}
                            />
                          </Box>
                        </Link>
                      </Box>
                      {/* Rating */}
                      <Typography sx={{ fontWeight: 400 }}>
                        {`${truncateRating(
                          item.beer.rating_score
                        ).toLocaleString(
                          "da"
                        )}/5 (${item.beer.rating_count.toLocaleString("da")})`}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Description */}
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      textAlign: "left",
                      color: "#1A1A1A",
                    }}
                  >
                    {item.beer.beer_description || (
                      <i>For dovne til en beskrivelse..</i>
                    )}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
