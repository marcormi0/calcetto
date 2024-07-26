// backend/utils/calculatePerformance.js

function calculatePerformance(ratings, stats) {
  //if (!ratings || ratings.length < 3) {
  if (!ratings) {
    return null; // Not enough ratings to calculate performance
  }

  // Calculate rating-based performance
  const sortedRatings = ratings.sort((a, b) => a - b);
  const outliersToRemove = Math.floor(ratings.length / 9);
  let trimmedRatings;
  if (outliersToRemove > 0 && ratings.length > 2 * outliersToRemove) {
    trimmedRatings = sortedRatings.slice(outliersToRemove, -outliersToRemove);
  } else {
    trimmedRatings = sortedRatings;
  }
  const ratingSum = trimmedRatings.reduce((acc, rating) => acc + rating, 0);
  const ratingAverage = ratingSum / trimmedRatings.length;

  // Calculate stats-based performance
  const totalMatches = stats.wins + stats.losses + stats.draws;
  if (totalMatches === 0) return ratingAverage; // If no matches played, return rating-based performance

  const winRate = stats.wins / totalMatches;
  const goalsPerMatch = stats.goals / totalMatches;
  const assistsPerMatch = stats.assists / totalMatches;

  // Assign weights to each factor (adjust these as needed)
  const weights = {
    rating: 0.5,
    winRate: 0.3,
    goalsPerMatch: 0.15,
    assistsPerMatch: 0.05,
  };

  // Calculate composite score (scale each factor to be roughly between 0-10)
  const compositeScore =
    ratingAverage * weights.rating +
    winRate * 10 * weights.winRate +
    Math.min(goalsPerMatch * 5, 10) * weights.goalsPerMatch +
    Math.min(assistsPerMatch * 5, 10) * weights.assistsPerMatch;

  return parseFloat(compositeScore.toFixed(2));
}

module.exports = calculatePerformance;
