/**
 * DTO Model for Venue Rating
 * Maps to GET /venues/{venueId}/ratings API response
 */
export class Rating {
  constructor(data, venueId = null) {
    this.rating = data.rating ?? 0;
    this.comment = data.comment ?? '';
    this.customerName = data.customer_name ?? 'Anonymous';
    this.createdAt = data.created_at ?? null;
    this.venueId = venueId;
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  get timeAgo() {
    if (!this.createdAt) return '';
    const diff = Date.now() - new Date(this.createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  static fromApi(data, venueId) {
    return new Rating(data, venueId);
  }
}

/**
 * Aggregated stats from a single venue ratings response
 */
export class VenueRatingStats {
  constructor(data, venueId) {
    this.venueId = venueId;
    this.averageRating = data.average_rating ?? 0;
    this.ratingsCount = data.ratings_count ?? 0;
  }
}