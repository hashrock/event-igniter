// Document https://fresh.deno.dev/docs/concepts/islands

import type { Signal } from "@preact/signals";
import { useRef } from "preact/hooks";

interface YoteiProps {
  yotei?: string;
  userId: string;
}
type Time = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Availability = "unavailable" | "maybe" | "available";
const times = [
  null,
  null,
  null,
  null,
  "12:00 - 15:00",
  "15:00 - 18:00",
  "18:00 - 21:00",
  "21:00 - 24:00",
];

interface Yotei {
  day: Day;
  time: Time;
  availability: Availability;
}
// Availabilityフォーマット
// <Day><Time><Availability>,<Day><Time><Availability>,....
// ex) 032,041,051,061,071,141,152,162,172,202,...

function parseYotei(yotei: string): Yotei[] {
  const yoteis = yotei.split(",");
  return yoteis.map((y) => {
    const day = Number(y[0]) as Day;
    const time = Number(y[1]) as Time;
    const availability = y[2] as Availability;
    return {
      day,
      time,
      availability,
    };
  });
}

export default function Yotei(props: YoteiProps) {
  const availabilityMap = new Map<Day, Map<Time, Availability>>();
  if (props.yotei) {
    const availability = parseYotei(props.yotei);
    availability.forEach((a) => {
      const timeMap = availabilityMap.get(a.day) ??
        new Map<Time, Availability>();
      timeMap.set(a.time, a.availability);
      availabilityMap.set(a.day, timeMap);
    });
  }

  const days: Day[] = [0, 1, 2, 3, 4, 5, 6];

  const tableRef = useRef<HTMLTableElement>(null);

  const onChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const day = Number(target.dataset.day) as Day;
    const time = Number(target.dataset.time) as Time;
    const availability = target.value as Availability;

    const timeMap = availabilityMap.get(day) ?? new Map<Time, Availability>();
    timeMap.set(time, availability);
    availabilityMap.set(day, timeMap);

    const yotei = Array.from(availabilityMap.entries())
      .map(([day, timeMap]) => {
        return Array.from(timeMap.entries())
          .map(([time, availability]) => {
            return `${day}${time}${availability}`;
          })
          .join(",");
      })
      .join(",");

    fetch("/api/yotei", {
      method: "POST",
      body: JSON.stringify({
        userId: props.userId,
        availability: yotei,
      }),
    });
  };

  return (
    <div>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th></th>
            <th>日</th>
            <th>月</th>
            <th>火</th>
            <th>水</th>
            <th>木</th>
            <th>金</th>
            <th>土</th>
          </tr>
        </thead>
        <tbody>
          {times.map((time, i) => {
            return (
              time &&
              (
                <tr>
                  <th>{time}</th>
                  {days.map((day) => {
                    const availability = availabilityMap.get(day)?.get(
                      i as Time,
                    );

                    return (
                      <td>
                        <select
                          value={availability ?? 0}
                          onChange={onChange}
                          data-day={day}
                          data-time={i}
                        >
                          <option value="2">○</option>
                          <option value="1">△</option>
                          <option value="0">×</option>
                        </select>
                      </td>
                    );
                  })}
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
