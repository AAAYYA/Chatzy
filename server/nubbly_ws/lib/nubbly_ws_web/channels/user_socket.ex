defmodule NubblyWsWeb.UserSocket do
  use Phoenix.Socket

  ## Ici chaque user rejoint son propre topic "user:123"
  channel "user:*", NubblyWsWeb.UserChannel

  @impl true
  def connect(%{"token" => jwt} = _params, socket, _info) do
    case verify_jwt(jwt) do
      {:ok, user_id} ->
        {:ok, assign(socket, :user_id, user_id)}

      :error ->
        :error
    end
  end

  @impl true
  def id(socket), do: "user:#{socket.assigns.user_id}"

  ## Helpers
  defp verify_jwt(token) do
    secret = Application.fetch_env!(:nubbly_ws, :jwt_secret)
    case Joken.verify(token, Joken.Signer.create("HS256", secret)) do
      {:ok, %{ "userId" => id } } -> {:ok, id}
      _ -> :error
    end
  end
end
