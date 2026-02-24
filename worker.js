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

    try {
      const { searchParams } = new URL(request.url);
      const api = searchParams.get('api');
      const param = searchParams.get('param');

      if (!api) return new Response(JSON.stringify({ erro: "Especifique a API" }), { headers });

      let url = "";
      // Definir a URL com base na API escolhida
      if (api === 'numverify') url = `http://apilayer.net/api/validate?access_key=${keys.numverify}&number=${param}`;
      else if (api === 'ipstack') url = `http://api.ipstack.com/${param}?access_key=${keys.ipstack}&hostname=1&security=1`;
      else if (api === 'weather') url = `http://api.weatherstack.com/current?access_key=${keys.weatherstack}&query=${param}`;
      else if (api === 'news') url = `http://api.mediastack.com/v1/news?access_key=${keys.mediastack}&languages=pt&limit=1`;
      else if (api === 'aviation') url = `http://api.aviationstack.com/v1/flights?access_key=${keys.aviationstack}&limit=1`;
      
      if (!url) return new Response(JSON.stringify({ erro: "API não configurada no Worker" }), { headers });

      // Chamada para a API externa
      const response = await fetch(url);
      
      // Verificação de segurança: A API respondeu algo válido?
      const text = await response.text();
      let d;
      try {
          d = JSON.parse(text);
      } catch (e) {
          return new Response(JSON.stringify({ erro: "A API não retornou um JSON válido", resposta_bruta: text }), { headers });
      }

      // Se a API retornou um erro interno (ex: success: false)
      if (d.success === false || d.error) {
          return new Response(JSON.stringify({ erro: "Erro na API Externa", detalhes: d.error || d }), { headers });
      }

      // Mapeamento de Extração Total (conforme seu api.txt)
      let data = {};
      if (api === 'numverify') {
          data = { valido: d.valid, numero: d.number, operadora: d.carrier, pais: d.country_name };
      } else if (api === 'ipstack') {
          data = { ip: d.ip, cidade: d.city, pais: d.country_name, isp: d.connection?.isp };
      } else if (api === 'weather') {
          data = { temp: d.current?.temperature, descricao: d.current?.weather_descriptions?.[0] };
      } else {
          data = d; // Retorna tudo se não houver mapeamento específico
      }

      return new Response(JSON.stringify(data), { headers });

    } catch (e) {
      return new Response(JSON.stringify({ erro: "Erro crítico no Worker", mensagem: e.message }), { headers });
    }
  }
};
