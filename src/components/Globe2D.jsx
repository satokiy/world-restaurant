import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import * as topojson from "topojson";
import versor from "versor";

async function fetchTopoJson() {
  return await d3.json("/data/topojson/output.topojson");
}

function removeAntarctica(topology) {
  const geometries = topology.objects.countries.geometries.filter((g) => {
    return g.properties.SOVEREIGNT != "Antarctica";
  });
  topology.objects.countries.geometries = geometries;
  return topology;
}

function Globe2D({ onCountryClick, onMouseOver, onMouseOut }) {
  const ref = useRef();
  const { data: topology, isLoading, error } = useQuery({
    queryKey: ["topojson"],
    queryFn: fetchTopoJson,
  });

  // SVGの幅と高さを設定する
  var width = 960;
  var height = 800;

  useEffect(() => {
    if (!topology) return;

    // 地理的な投影を作成する
    const projection = d3.geoEquirectangular()
      .translate([width / 2, height / 2]) // 地図の中心点を設定する
      .scale(150); // 地図のスケールを設定する

    // 地理的なパスジェネレータを作成する
    const path = d3.geoPath().projection(projection);

    // SVG要素を作成する
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    // TopoJSONデータから地理的な特徴を抽出する
    const topo = removeAntarctica(topology);
    const geojson = topojson.feature(topo, topo.objects.countries);

    // 地理的な特徴をもとにパス要素を作成する
    svg.selectAll("path")
      .data(geojson.features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "#69b3a2")
      .attr("filter", "url(#dropshadow)")
      .on("click", function(d) {
        onCountryClick(d);
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    function mouseover(d) {
      onMouseOver(d);
    }
    function mouseout(d) {
      onMouseOut(d);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <svg ref={ref} width="100%" height="100%" />;
}

export default Globe2D;
