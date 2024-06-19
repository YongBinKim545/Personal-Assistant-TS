const BASE_URL: { [key in string]: string } = {
  'local-server': 'http://localhost:3132',
  'ollama-server': 'http://localhost:5000'
}

const getFirstLayerUrl = (url: string): string => {
  const match = url.match(/^(.*?)\//);
  return match ? match[1] : url;
}
export const fetchData = async (endpoint: string, options = {}) => {
  try {
    const serverName = getFirstLayerUrl(endpoint).replace('/', "")
    const baseUrl = BASE_URL[serverName]
    if (baseUrl === undefined) throw new Error(`Could not determine baseUrl for endpoint: ${endpoint}`); // Throw an error
    const targetUrl = endpoint.slice(serverName.length)
    // console.log(`baseurl:${baseUrl}, targetUrl:${targetUrl}`)
    const newEndPoint = baseUrl + targetUrl
    const response = await fetch(newEndPoint, options)
    return response
  } catch (error) {
    console.error('Error building restapi:', error);
  }
}

export const filterData = (keyword: string | undefined, contents: any[]) => {
  const searchKeyword = keyword?.toLowerCase();
  if (!searchKeyword) return contents;
  const filtered = contents.filter((item) => {
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = String(item[key]).toLowerCase();
        if (value.includes(searchKeyword)) {
          return true;
        }
      }
    }
    return false;
  });
  return filtered.length > 0 ? filtered : [];
}