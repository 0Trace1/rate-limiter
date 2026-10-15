local key = KEYS[1]

local now=tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local requestId = ARGV[4]

local cutoff=now-window

-- Remove requests outside the window
redis.call('ZREMRANGEBYSCORE',key,'-inf',cutoff)

-- count requests currently in the window
local count=redis.call('ZCARD',key)

-- reject if limit has reached
if count>=limit then
    local oldest=redis.call('ZRANGE',key,0,0,'WITHSCORES')
    local retryAfterMs=0
    if #oldest>=2 then
        retryAfterMs=tonumber(oldest[2]+window-now)
    end
    return {0,count,math.max(retryAfterMs,0)}
end

-- record the accepted request
redis.call('ZADD',key,now,requestId)

-- Remove inactive keys automatically
redis.call('PEXPIRE',key,window)

return {
    1,count+1,0
}
