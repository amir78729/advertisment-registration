class AdvertisementDTO {
  static output(data) {
    const { id, description, email, state, image, category } = data;
    return { id, description, email, state, image, category };
  }
}

module.exports = AdvertisementDTO;