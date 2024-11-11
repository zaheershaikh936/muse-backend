import { Injectable } from '@nestjs/common';

@Injectable()
export class CountryService {
  async getAll() {
    const response = await fetch(
      'https://countriesnow.space/api/v0.1/countries',
    );
    const data = await response.json();
    const result = [];
    if (!data.error) {
      for (const country of data?.data) {
        result.push({
          label: country.country,
          value: country.country,
        });
      }
    }
    return result;
  }

  async getCity(country: string) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify({ country });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };
    const response = await fetch(
      'https://countriesnow.space/api/v0.1/countries/cities',
      requestOptions,
    );
    const data = await response.json();
    const result = [];
    if (!data.error) {
      for (const city of data?.data) {
        result.push({
          label: city,
          value: city,
        });
      }
    }
    return result;
  }
}
