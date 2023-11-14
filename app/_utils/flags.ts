import * as countries from "@/app/countries.json";

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

export default getFlags;
