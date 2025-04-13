from app.db.queries.dashboard_queries import (
    get_user_overall_stats,
    get_weekly_progress,
    get_difficulty_stats,
    get_recent_activities,
    get_performance_metrics
)

class DashboardService:
    @staticmethod
    async def get_user_stats(user_id: int):
        return await get_user_overall_stats(user_id)
    
    @staticmethod
    async def get_weekly_stats(user_id: int):
        return await get_weekly_progress(user_id)
    
    @staticmethod
    async def get_difficulty_stats(user_id: int):
        return await get_difficulty_stats(user_id)
    
    @staticmethod
    async def get_recent_activities(user_id: int, limit: int = 10):
        return await get_recent_activities(user_id, limit)
    
    @staticmethod
    async def get_performance_metrics(user_id: int):
        return await get_performance_metrics(user_id)
