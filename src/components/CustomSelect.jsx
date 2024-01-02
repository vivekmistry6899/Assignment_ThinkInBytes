import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const CustomSelect = () => {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBeers = async (searchQuery, page) => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://api.punkapi.com/v2/beers", {
        params: {
          per_page: 12,
          ...(searchQuery.length > 0 && { beer_name: searchQuery }),
          page: page,
        },
      });

      const newBeerOptions = response.data.map((beer) => ({
        value: beer.id.toString(),
        label: beer.name,
      }));

      setIsLoading(false);
      return newBeerOptions;
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      return [];
    }
  };

  const handleSelectionChange = (selectedOption) => {
    setSelectedValues(selectedOption);
  };

  useEffect(() => {
    loadBeerOptions("", (newOptions) => {
      setOptions(newOptions);
    });
  }, [currentPage]);

  const loadBeerOptions = async (inputValue, callback) => {
    if (!inputValue) {
      const newOptions = await fetchBeers("", currentPage);
      setOptions((prevOptions) => [...prevOptions, ...newOptions]);
      callback([...options, ...newOptions]);
    } else {
      const newOptions = await fetchBeers(inputValue, 1);
      callback(newOptions);
    }
  };

  const customStyles = {
    indicatorSeparator: () => null,
    indicatorsContainer: () => ({ display: "none" }),
  };
  return (
    <Select
      isMulti
      value={selectedValues}
      options={options}
      isLoading={isLoading}
      loadingMessage={() => "Loading..."}
      styles={customStyles}
      noOptionsMessage={() => "No options found"}
      placeholder="Search beers..."
      onChange={handleSelectionChange}
      onInputChange={(inputValue) => {
        loadBeerOptions(inputValue, (newOptions) => {
          setOptions(newOptions);
        });
      }}
      onMenuScrollToBottom={() => {
        setCurrentPage((prevPage) => prevPage + 1);
      }}
    />
  );
};

export default CustomSelect;
