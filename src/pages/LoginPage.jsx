const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  setError('');

  try {
    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Регистрация прошла успешно. Проверь почту и открой новое письмо с подтверждением.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    }
  } catch (err) {
    setError('Произошла ошибка.');
  } finally {
    setLoading(false);
  }
};