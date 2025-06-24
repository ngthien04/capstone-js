export class Service {
  getPhones = async () => {
    try {
      const res = await axios({
        url: 'https://685655e01789e182b37db36f.mockapi.io/api/Product',
        method: 'GET',
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  getPhoneById = async (id) => {
    try {
      const res = await axios({
        url: `https://685655e01789e182b37db36f.mockapi.io/api/Product/${id}`,
        method: 'GET',
      });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
}