addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Configuração de CORS para permitir que seu site acesse o Worker
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (request.method === "OPTIONS") return new Response(null, { headers })

  const { searchParams } = new URL(request.url)
  const api = searchParams.get('api')
  const param = searchParams.get('param')

  [span_3](start_span)[span_4](start_span)[span_5](start_span)// Chaves do seu arquivo[span_3](end_span)[span_4](end_span)[span_5](end_span)
  const keys = {
    numverify: '37c50a4c4aaf752f098edc2caf52c752',
    ipstack: 'a9b57e3b51c26e5418baabf34be67947',
    coinlayer: '49a4c82a024139de90b2bb2c457a6b75',
    weather: '0d594e7f43e48ecc64cf2c4a792ef36e',
    aviation: '36a53d4825cb1729c3a81bf895f4100c',
    media: '3753b71e2e4af93251c56c8e44888655'
  }

  try {
    let url, r, d;

    switch(api) {
      case 'numverify':
        url = `http://apilayer.net/api/validate?access_key=${keys.numverify}&number=${param}`;
        r = await fetch(url); d = await r.json();
        return new Response(JSON.stringify({
          valido: d.valid, numero: d.number, formato_local: d.local_format, formato_int: d.international_format,
          prefixo_pais: d.country_prefix, codigo_pais: d.country_code, nome_pais: d.country_name,
          localizacao: d.location, operadora: d.carrier, tipo_linha: d.line_type
        [span_6](start_span)}), { headers });[span_6](end_span)

      case 'ipstack':
        url = `http://api.ipstack.com/${param}?access_key=${keys.ipstack}&hostname=1&security=1`;
        r = await fetch(url); d = await r.json();
        return new Response(JSON.stringify({
          ip: d.ip, tipo: d.type, continente: d.continent_name, pais: d.country_name, regiao: d.region_name,
          cidade: d.city, cep: d.zip, latitude: d.latitude, longitude: d.longitude, fuso_horario: d.time_zone?.id,
          moeda: d.currency?.name, conexao_isp: d.connection?.isp, seguranca_proxy: d.security?.is_proxy,
          seguranca_vpn: d.security?.is_vpn, seguranca_tor: d.security?.is_tor
        [span_7](start_span)}), { headers });[span_7](end_span)

      case 'weather':
        url = `http://api.weatherstack.com/current?access_key=${keys.weather}&query=${param}`;
        r = await fetch(url); d = await r.json();
        return new Response(JSON.stringify({
          temp: d.current.temperature, sensacao: d.current.feelslike, vento: d.current.wind_speed,
          humidade: d.current.humidity, uv: d.current.uv_index, visibilidade: d.current.visibility,
          pressao: d.current.pressure, is_day: d.current.is_day, descricao: d.current.weather_descriptions[0]
        [span_8](start_span)}), { headers });[span_8](end_span)

      default:
        return new Response(JSON.stringify({ error: "API não encontrada" }), { headers, status: 404 })
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { headers, status: 500 })
  }
}
