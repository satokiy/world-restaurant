import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import * as topojson from "topojson";
import versor from "versor";

async function fetchTopoJson() {
  return await d3.json("/data/topojson/output.topojson");
}

function Globe({ onCountryClick }) {
  const ref = useRef();
  const { data: topology, isLoading, error } = useQuery({
    queryKey: ["topojson"],
    queryFn: fetchTopoJson,
  });

  useEffect(() => {
    if (!topology) return;

    const svg = d3.select(ref.current)
      .attr("viewBox", "0 0 960 500")
      .attr("preserveAspectRatio", "xMidYMid meet");
    
      const projection = d3.geoOrthographic()
      .scale(250)
      .translate([480, 250])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    svg.append("path")
      .datum({ type: "Sphere" })
      .attr("class", "ocean")
      .attr("d", path);

    const drag = d3.drag().touchable(navigator.maxTouchPoints)
      .on("start", dragstarted)
      .on("drag", dragged);

    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "dropshadow")
      .attr("height", "130%");
    filter.append("feDropShadow")
      .attr("dx", 0.2)
      .attr("dy", 0.2)
      .attr("stdDeviation", 1);
    

    const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', function(event) {
      countries.attr('transform', event.transform);
    });

    const countries = svg.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries).features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "#69b3a2")
      .attr("filter", "url(#dropshadow)")
      .call(drag)
      .call(zoom)
      .on("click", function(d) {
        onCountryClick(d);
      });

    function dragstarted() {
      this.v0 = versor.cartesian(projection.invert(d3.mouse(this)));
      this.r0 = projection.rotate();
      this.q0 = versor(this.r0);
    }

    function dragged() {
      var v1 = versor.cartesian(projection.rotate(this.r0).invert(d3.mouse(this))),
        q1 = versor.multiply(this.q0, versor.delta(this.v0, v1)),
        r1 = versor.rotation(q1);
      projection.rotate(r1);
      countries.attr("d", path);
    }
  }, [topology, onCountryClick]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <svg ref={ref} width="100%" height="100%" />;
}

export default Globe;
