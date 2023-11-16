"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import { Box, CardActionArea, Card, Typography } from "@mui/material";

import getFlags from "../_utils/flags";

export default function BeerCard({
  item,
  customListId,
}: {
  item: ListItem;
  customListId?: string;
}) {
  const [checked, setChecked] = useState(false);

  const showServingStyle = (servingStyle: string, quantity: number) => {
    const imageSize = 25;

    return [...Array(quantity)].map((x, i) => (
      <Image
        key={i}
        alt={servingStyle}
        src={`https://assets.untappd.com/static_app_assets/${servingStyle.toLowerCase()}@3x.png`}
        width={imageSize}
        height={imageSize}
        style={{ marginLeft: -10 }} /* Fix dumb image size */
      />
    ));
  };

  const showABVIBU = (abv: number, ibu?: number) => {
    let output = `${abv.toLocaleString("da")}%`;
    if (ibu) {
      output += `, ${ibu} IBU`;
    }

    return output;
  };

  const truncateRating = (rating: number) => Math.trunc(rating * 100) / 100;

  const toggleCard = () => {
    const newState = !checked;

    setChecked(newState);

    localStorage.setItem(
      `beer-cards-${customListId}-${item.beer.bid}`,
      newState.toString()
    );
  };

  useEffect(() => {
    const checkedBeer = localStorage.getItem(
      `beer-cards-${customListId}-${item.beer.bid}`
    );

    if (checkedBeer === "true") {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid xs={12} lg={6} key={item.beer.bid} sx={{ display: "flex" }}>
      <Card sx={{ width: "100%", position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
            px: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Link
            href={`https://untappd.com/b/${item.beer.beer_slug}/${item.beer.bid}`}
            target="_blank"
            style={{ marginTop: 6 }}
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
                width="20"
                height="20"
                style={{ marginRight: 8 }}
              />
            </Box>
          </Link>
          <Box
            sx={{
              height: 25,
              color: "#919191",
            }}
          >
            {item.container.container_name &&
              showServingStyle(item.container.container_name, item.quantity)}
          </Box>
        </Box>
        <CardActionArea
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            height: "100%",
          }}
          onClick={toggleCard}
        >
          {checked && (
            <Box
              sx={{
                position: "absolute",
                height: "100%",
                width: "100%",
                background: "rgba(255, 255, 255, 0.6)",
                top: 0,
                left: 0,
                zIndex: 1000,
              }}
            />
          )}

          <Box sx={{ textAlign: "center", width: "100%" }}>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "pre-wrap",
                }}
              >
                {/* ABV/IBU */}
                <Typography sx={{ fontWeight: 400 }}>
                  {showABVIBU(item.beer.beer_abv, item.beer.beer_ibu)} {" - "}
                </Typography>
                {/* Rating */}
                <Typography sx={{ fontWeight: 400 }}>
                  {`${truncateRating(item.beer.rating_score).toLocaleString(
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
        </CardActionArea>
      </Card>
    </Grid>
  );
}
