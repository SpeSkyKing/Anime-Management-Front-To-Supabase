import { LoginProps } from "../data/props";
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const LoginEntry: React.FC<LoginProps> = ({ onLogin }) => {
  const [onRegist, setOnRegist] = useState(false);
  const [loginUserName, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registUserName, setRegistUserName] = useState("");
  const [registPassword, setRegistPassword] = useState("");
  const [registPasswordAgain, setRegistPasswordAgain] = useState("");

  const turnClick = () => {
    setOnRegist(!onRegist);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!loginUserName){
      alert("ユーザー名を入力してください");
      return;
    }
    if(!loginPassword){
      alert("パスワードを入力してください");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginUserName,
        password: loginPassword,
      });
      if (error) {
        alert(error.message || "ログインに失敗しました。");
      } else {
        alert("ログインしました。");
        onLogin(data.session?.access_token || '');
      }
    } catch (error) {
      console.log(error);
      alert('エラーが発生しました');
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!registUserName){
      alert("ユーザー名を入力してください");
      return;
    }
    if(!registPassword){
      alert("パスワードを入力してください");
      return;
    }
    if(!registPasswordAgain){
      alert("パスワード確認を入力してください");
      return;
    }
    if (registPassword !== registPasswordAgain) {
      alert("パスワードが一致しません。");
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email: registUserName,
        password: registPassword,
      });
      if (error) {
        alert(error.message || "登録に失敗しました。");
      } else {
        alert("登録に成功しました。");
        turnClick();
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("サーバーエラーが発生しました。");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-500">
      <div className="content-container flex justify-center items-center h-full bg-gradient-to-br from-green-400 via-teal-300 to-blue-500 text-white p-6 rounded-t-lg shadow-lg">
        <div className="flex justify-center items-center p-8 bg-gray-100 bg-opacity-50 min-h-full min-w-full">
          <div className="flex flex-col justify-center items-center p-8 bg-gray-100 bg-opacity-50 rounded-lg shadow-md">
            <div>
              {onRegist ? (
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">登録</h1>
                  <form onSubmit={handleRegistration} className="flex flex-col gap-4 w-80">
                    <div>
                      <label htmlFor="registUserName" className="block text-gray-700 font-medium mb-2">
                        メールアドレス
                      </label>
                      <input
                        id="registUserName"
                        type="email"
                        placeholder="メールアドレスを入力"
                        value={registUserName}
                        onChange={(e) => setRegistUserName(e.target.value)}
                        className="!text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="registPassword" className="block text-gray-700 font-medium mb-2">
                        パスワード
                      </label>
                      <input
                        id="registPassword"
                        type="password"
                        placeholder="パスワードを入力"
                        value={registPassword}
                        onChange={(e) => setRegistPassword(e.target.value)}
                        className="!text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="registPasswordAgain" className="block text-gray-700 font-medium mb-2">
                        パスワード確認
                      </label>
                      <input
                        id="registPasswordAgain"
                        type="password"
                        placeholder="パスワードを再入力"
                        value={registPasswordAgain}
                        onChange={(e) => setRegistPasswordAgain(e.target.value)}
                        className="!text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition"
                    >
                      登録
                    </button>
                  </form>
                  <p className="mt-4 text-sm text-gray-700">
                    既にアカウントをお持ちですか？{" "}
                    <a onClick={turnClick} className="text-blue-500 underline hover:text-blue-700">
                      ログイン
                    </a>
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">ログイン</h1>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
                    <div>
                      <label htmlFor="loginUserName" className="block text-gray-700 font-medium mb-2">
                        メールアドレス
                      </label>
                      <input
                        id="loginUserName"
                        type="email"
                        placeholder="メールアドレスを入力"
                        value={loginUserName}
                        onChange={(e) => setLoginUserName(e.target.value)}
                        className="!text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="loginPassword" className="block text-gray-700 font-medium mb-2">
                        パスワード
                      </label>
                      <input
                        id="loginPassword"
                        type="password"
                        placeholder="パスワードを入力"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="!text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition"
                    >
                      ログイン
                    </button>
                  </form>
                  <p className="mt-4 text-sm text-gray-700">
                    アカウントをお持ちでない方は{" "}
                    <a onClick={turnClick} className="text-blue-500 underline hover:text-blue-700">
                      登録
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEntry;
