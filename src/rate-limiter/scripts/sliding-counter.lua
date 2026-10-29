local currentKey=KEYS[1]
local previousKey=KEYS[2]

local now=tonumber(ARGV[1])
local windowMs=tonumber(ARGV[2])
local limit=tonumber(ARGV[3])

-- Position within the current window
local elapsed =now%windowMs
local elapsedRatio=elapsed/windowMs

-- Read the two bucket counts
local currentCount=tonumber( redis.call('GET',currentKey) or '0' )
local previousCount=tonumber(redis.call('GET',previousKey) or '0' )

-- Estimate requests in the rolling window
local weightedPrevious = previousCount * (1 - elapsedRatio)
local estimatedCount = weightedPrevious + currentCount

-- Reject if the estimated count has reached the limit
if estimatedCount >= limit then
    local retryAfterMs=windowMs - elapsed

    return {
        0,
        estimatedCount,
        retryAfterMs
    }
end

-- Accept the request and increment the current bucket
local newCount = redis.call('INCR',currentKey)

-- Keep the bucket available through its next window
if newCount == 1 then
    redis.call('PEXPIRE',currentKey,windowMs*2)
end

local updatedEstimate = weightedPrevious + newCount

return {
    1,
    updatedEstimate,
    0
}