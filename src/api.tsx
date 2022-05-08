import request from 'superagent';

const baseUrl = 'http://localhost:8080/v1';
const DefaultHeaders: Record<string, any> = {};

if (localStorage.getItem('access_token')) {
  DefaultHeaders['authorization'] = localStorage.getItem('access_token');
}

export async function postApi(
  url: string,
  data: Record<string, any>
): Promise<Record<string, any>> {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await request.post(`${baseUrl}${url}`).set(DefaultHeaders).send(data);
    return response;
  } catch (error: unknown) {
    throw error;
  }
}

export async function getApi(
  url: string,
): Promise<Record<string, any>> {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await request.get(`${baseUrl}${url}`).set(DefaultHeaders);
    return response;
  } catch (error: unknown) {
    throw error;
  }
}

export async function deleteApi(
  url: string,
): Promise<Record<string, any>> {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await request.delete(`${baseUrl}${url}`).set(DefaultHeaders);
    return response;
  } catch (error: unknown) {
    throw error;
  }
}