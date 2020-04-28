export default function ({ app, redirect, $axios }) {
  $axios.onError(() => {
    console.log('服务器请求失败')
  })
  $axios.onResponse((response) => {
    if (response.data.status === 'NOT_FOUND') {
      redirect('/404')
    } else if (response.data.status === 'INTERNAL_SERVER_ERROR') {
      console.log('内部服务器错误')
    }
  })
}
