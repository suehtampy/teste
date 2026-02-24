// - Chaves e Funções Integradas do Arquivo Original
const keys = {
    numverify: '37c50a4c4aaf752f098edc2caf52c752',
    ipstack: 'a9b57e3b51c26e5418baabf34be67947',
    coinlayer: '49a4c82a024139de90b2bb2c457a6b75',
    weatherstack: '0d594e7f43e48ecc64cf2c4a792ef36e',
    aviationstack: '36a53d4825cb1729c3a81bf895f4100c',
    mediastack: '3753b71e2e4af93251c56c8e44888655',
    userstack: '37c50a4c4aaf752f098edc2caf52c752',
    languagelayer: 'a90535700eface3cd7c611ecd26fc85e'
};

export default {
  async fetch(request) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    if (request.method === "OPTIONS") return new Response(null, { headers });

    const { searchParams } = new URL(request.url);
    const api = searchParams.get('api');
    const param = searchParams.get('param');

    try {
      let url;
      if (api === 'numverify') url = `http://apilayer.net/api/validate?access_key=${keys.numverify}&number=${param}`;
      else if (api === 'ipstack') url = `http://api.ipstack.com/${param}?access_key=${keys.ipstack}&hostname=1&security=1`;
      else if (api === 'weather') url = `http://api.weatherstack.com/current?access_key=${keys.weatherstack}&query=${param}`;
      else if (api === 'coin') url = `http://api.coinlayer.com/api/live?access_key=${keys.coinlayer}&symbols=${param}`;
      else if (api === 'news') url = `http://api.mediastack.com/v1/news?access_key=${keys.mediastack}&languages=pt&limit=1`;
      else if (api === 'aviation') url = `http://api.aviationstack.com/v1/flights?access_key=${keys.aviationstack}&limit=1`;
      else if (api === 'lang') url = `http://api.languagelayer.com/detect?access_key=${keys.languagelayer}&query=${encodeURIComponent(param)}`;
      else if (api === 'user') url = `http://api.userstack.com/detect?access_key=${keys.userstack}&ua=${encodeURIComponent(param)}`;

      const res = await fetch(url);
      const d = await res.json();

      // Mapeamento de Extração Total baseado no seu arquivo:
      let data = {};
      if (api === 'numverify') {
          data = { valido: d.valid, numero: d.number, formato_local: d.local_format, formato_int: d.international_format, prefixo_pais: d.country_prefix, codigo_pais: d.country_code, nome_pais: d.country_name, localizacao: d.location, operadora: d.carrier, tipo_linha: d.line_type };
      } else if (api === 'ipstack') {
          data = { ip: d.ip, tipo: d.type, continente: d.continent_name, pais: d.country_name, regiao: d.region_name, cidade: d.city, cep: d.zip, latitude: d.latitude, longitude: d.longitude, fuso_horario: d.time_zone?.id, moeda: d.currency?.name, conexao_isp: d.connection?.isp, seguranca_proxy: d.security?.is_proxy, seguranca_vpn: d.security?.is_vpn, seguranca_tor: d.security?.is_tor };
      } else if (api === 'weather') {
          data = { temp: d.current.temperature, sensacao: d.current.feelslike, vento: d.current.wind_speed, humidade: d.current.humidity, uv: d.current.uv_index, visibilidade: d.current.visibility, pressao: d.current.pressure, is_day: d.current.is_day, descricao: d.current.weather_descriptions[0] };
      } else if (api === 'news') {
          const n = d.data[0];
          data = { autor: n.author, titulo: n.title, descricao: n.description, fonte: n.source, categoria: n.category, url: n.url, data: n.published_at };
      } else if (api === 'aviation') {
          const f = d.data[0];
          data = { voo_iata: f.flight.iata, status: f.flight_status, origem: f.departure.airport, origem_terminal: f.departure.terminal, destino: f.arrival.airport, companhia: f.airline.name, aeronave: f.aircraft?.registration };
      } else if (api === 'coin') {
          data = { sucesso: d.success, timestamp: d.timestamp, base: d.target, valor: d.rates[param] };
      } else if (api === 'lang') {
          data = { idioma: d.results[0].language_name, codigo: d.results[0].language_code, probabilidade: d.results[0].probability, confiavel: d.results[0].reliable_result };
      } else if (api === 'user') {
          data = { dispositivo_tipo: d.device.type, dispositivo_marca: d.device.brand, so_nome: d.os.name, so_versao: d.os.version, browser_nome: d.browser.name, browser_versao: d.browser.version, engine: d.browser.engine };
      }

      return new Response(JSON.stringify(data), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ erro: "Falha na Extração: " + e.message }), { headers, status: 200 });
    }
  }
};
