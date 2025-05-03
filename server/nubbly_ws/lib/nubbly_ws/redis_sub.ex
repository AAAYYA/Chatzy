defmodule NubblyWs.RedisSub do
  use GenServer

  @channel "nubbly:messages"

  def start_link(_args) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

    @impl true
    def init(_) do
    result = Redix.PubSub.start_link(host: "localhost", port: 6379)
    IO.inspect(result, label: "🔎 Redix.PubSub.start_link/1")

    case result do
        {:ok, pubsub_pid} ->
        {:ok, _ref} = Redix.PubSub.subscribe(pubsub_pid, @channel, self())
        {:ok, pubsub_pid}

        {:error, reason} ->
        IO.puts("❌ Could not start Redix.PubSub: #{inspect(reason)}")
        {:stop, reason}
    end
    end

  @impl true
  def handle_info({:redix_pubsub, _pubsub, :message, %{channel: @channel, payload: payload}}, state) do
    case Jason.decode(payload) do
      {:ok, %{"toUserId" => uid} = msg} ->
        topic = "user:" <> Integer.to_string(uid)
        NubblyWsWeb.Endpoint.broadcast(topic, "push", msg)

      _ ->
        IO.puts("❌ Could not decode message: #{payload}")
    end

    {:noreply, state}
  end

  def handle_info(_, state), do: {:noreply, state}
end
