desc "Pings PING_URL to keep a dyno alive"
task :dyno_ping do
  require "net/http"
  if ENV['https://blender20.herokuapp.com/']
    uri = URI(ENV['https://blender20.herokuapp.com/'])
    Net::HTTP.get_response(uri)
  end
end
