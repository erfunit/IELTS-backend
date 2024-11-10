export function getIeltsBand(
  correctAnswers: number,
  testType: "LISTENING" | "READING"
) {
  // Define band ranges for each test type
  const bandRanges = {
    READING: [
      { min: 39, max: 40, band: 9 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8 },
      { min: 33, max: 34, band: 7.5 },
      { min: 30, max: 32, band: 7 },
      { min: 27, max: 29, band: 6.5 },
      { min: 23, max: 26, band: 6 },
      { min: 19, max: 22, band: 5.5 },
      { min: 15, max: 18, band: 5 },
      { min: 13, max: 14, band: 4.5 },
      { min: 10, max: 12, band: 4 },
    ],
    LISTENING: [
      { min: 39, max: 40, band: 9 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8 },
      { min: 32, max: 34, band: 7.5 },
      { min: 30, max: 31, band: 7 },
      { min: 26, max: 29, band: 6.5 },
      { min: 23, max: 25, band: 6 },
      { min: 18, max: 22, band: 5.5 },
      { min: 16, max: 17, band: 5 },
      { min: 13, max: 15, band: 4.5 },
      { min: 10, max: 12, band: 4 },
    ],
  };

  // Get the ranges for the specified test type
  const ranges = bandRanges[testType];
  if (!ranges) {
    return "Invalid test type";
  }

  // Find the band score based on correct answers
  for (const range of ranges) {
    if (correctAnswers >= range.min && correctAnswers <= range.max) {
      return range.band;
    }
  }
}
