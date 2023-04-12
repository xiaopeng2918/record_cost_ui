import s from './style.module.less'
import { List, Input, Button, Checkbox, Toast } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import Captcha from 'react-captcha-code'
import { useCallback } from 'react'
import { useState } from 'react'
import { post } from '@/utils'
import cl from 'classnames'

function Login() {
  const [type, setType] = useState('login') // 页面类型 login or sign up

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [vertify, setVertify] = useState('')
  const [captcha, setCaptcha] = useState('')
  // 拿到图片验证码
  const handleChange = useCallback((captcha: string) => {
    console.log('captcha', captcha)
    setCaptcha(captcha)
  }, [])
  // 注册方法 登录合用
  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if (type == 'login') {
        const { data } = await post('/user/login', {
          username,
          password
        })
        localStorage.setItem('token', data.token)
        return
      } else {
        if (!vertify) {
          Toast.show('请输入验证码')
          return
        }
        if (vertify != captcha) {
          Toast.show('验证码有误')
          return
        }
        const { data } = await post('/user/register', {
          username,
          password
        })
        Toast.show('注册成功')
        // 注册成功，自动将 tab 切换到 login 状态
        setType('login')
      }
    } catch (err) {
      Toast.show('系统错误111')
    }
  }
  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span className={cl({ [s.active]: type == 'login' })} onClick={() => setType('login')}>
          登录
        </span>
        <span className={cl({ [s.active]: type == 'register' })} onClick={() => setType('register')}>
          注册
        </span>
      </div>
      <div className={s.form}>
        <List>
          <List.Item prefix={<CustomIcon type="zhanghao" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入账号"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value as string)}
            />
          </List.Item>
          <List.Item prefix={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="password"
              placeholder="请输入密码"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value as string)}
            />
          </List.Item>

          {type == 'register' && (
            <List.Item prefix={<CustomIcon type="mima" />}>
              <Input
                clearable
                type="text"
                placeholder="请输入验证码"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVertify(e.target.value as string)}
              />
              <Captcha charNum={4} onChange={handleChange} />
            </List.Item>
          )}
        </List>
      </div>
      <div className={s.operation}>
        <div className={s.agree}>
          <Checkbox />
          <label className="text-light">授权并同意</label>
        </div>
        <Button block theme="primary" size="lg" onClick={onSubmit}>
          {type == 'login' ? '登录' : '注册'}
        </Button>
      </div>
    </div>
  )
}

export default Login
