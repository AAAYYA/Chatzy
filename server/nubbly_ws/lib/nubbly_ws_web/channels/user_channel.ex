defmodule NubblyWsWeb.UserChannel do
  use Phoenix.Channel

  # Un user ne peut rejoindre *que* son propre topic
  @impl true
  def join("user:" <> user_id, _payload, socket) do
    if Integer.to_string(socket.assigns.user_id) == user_id do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Ping facultatif
  @impl true
  def handle_in("ping", _payload, socket) do
    {:reply, %{ok: true}, socket}
  end

  # Relais des broadcasts "push" venant de Redis
  @impl true
  def handle_info(%Phoenix.Socket.Broadcast{event: "push", payload: payload}, socket) do
    push(socket, "push", payload)
    {:noreply, socket}
  end
end
