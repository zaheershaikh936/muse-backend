export const getIso2Code = async (country: string) => {
  const response = await fetch(
    'https://countriesnow.space/api/v0.1/countries/states',
    {
      method: 'POST',
      body: JSON.stringify({
        country: country,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow' as RequestRedirect,
    },
  );
  const data = await response.json();
  const iso2: string = data?.data?.iso2;
  const raw = JSON.stringify({
    iso2: iso2,
  });
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };

  const flagResponse = await fetch(
    'https://countriesnow.space/api/v0.1/countries/flag/images',
    requestOptions,
  );
  const flagData = await flagResponse.json();
  return { iso2, flag: flagData?.data?.flag };
};
