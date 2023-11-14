"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  CardActionArea,
  Card as MUICard,
  Typography,
} from "@mui/material";

import getFlags from "../_utils/flags";

export default function Card({ item }: { item: ListItem }) {
  const [toggled, setToggled] = useState(false);

  const showServingStyle = (servingStyle: string) => {
    const size = 25;
    return (
      <Image
        alt={servingStyle}
        src={`https://assets.untappd.com/static_app_assets/${servingStyle.toLowerCase()}@3x.png`}
        width={size}
        height={size}
      />
    );
  };

  const showABVIBU = (abv: number, ibu?: number) => {
    let output = `${abv.toLocaleString("da")}%`;
    if (ibu) {
      output += `, ${ibu} IBU`;
    }

    return output;
  };

  const truncateRating = (rating: number) => Math.trunc(rating * 100) / 100;

  const toggleCard = () => setToggled(!toggled);

  return (
    <Grid xs={12} lg={6} key={item.beer.bid} sx={{ display: "flex" }}>
      <MUICard sx={{ width: "100%" }}>
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
          {toggled && (
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              height: 25,
              color: "#919191",
            }}
          >
            {item.container.container_name && (
              <>
                {item.quantity}x{" "}
                {showServingStyle(item.container.container_name)}
              </>
            )}
          </Box>

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
      </MUICard>
    </Grid>
  );
}
