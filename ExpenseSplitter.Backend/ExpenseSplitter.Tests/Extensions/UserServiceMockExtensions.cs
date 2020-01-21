using System;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace ExpenseSplitter.Tests.Extensions
{
    public static class UserServiceMockExtensions
    {
        public static void ImpersonateUser(this Mock<IUserService> userService, User user)
        {
            userService.Setup(x => x.GetCurrentUser()).Returns(user);
            userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);
        }
    }
}