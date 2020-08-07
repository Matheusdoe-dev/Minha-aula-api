export default function convertHoursToMinutes(time: string) {
  const x = time.split(":");
  const y = Number(x[0]) * 60 + Number(x[1]);
  return y;
}
