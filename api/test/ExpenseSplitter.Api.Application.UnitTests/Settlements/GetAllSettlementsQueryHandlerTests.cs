using ExpenseSplitter.Api.Application.Abstractions.Authentication;
using ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;
using ExpenseSplitter.Api.Domain.Expenses;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;
using ExpenseSplitter.Api.Domain.Users;

namespace ExpenseSplitter.Api.Application.UnitTests.Settlements;

public class GetAllSettlementsQueryHandlerTests
{
    private readonly Fixture fixture = CustomFixture.Create();
    private readonly ISettlementRepository settlementRepository = Substitute.For<ISettlementRepository>();
    private readonly IExpenseRepository expenseRepository = Substitute.For<IExpenseRepository>();
    private readonly ISettlementUserRepository settlementUserRepository = Substitute.For<ISettlementUserRepository>();
    private readonly IUserContext userContext = Substitute.For<IUserContext>();
    private readonly GetSettlementsQueryHandler handler;

    public GetAllSettlementsQueryHandlerTests()
    {
        handler = new GetSettlementsQueryHandler(
            settlementRepository,
            expenseRepository,
            settlementUserRepository,
            userContext);
    }

    [Fact]
    public async Task Handle_ShouldMapSettlementsToDto()
    {
        var userId = fixture.Create<UserId>();
        var settlements = fixture.CreateMany<Settlement>(2).ToList();
        var query = fixture.Create<GetAllSettlementsQuery>();
    
        userContext.UserId.Returns(userId);
        
        settlementRepository
            .GetPaged(userId, query.Page, query.PageSize, Arg.Any<CancellationToken>())
            .Returns(settlements);

        expenseRepository
            .GetAllBySettlementId(Arg.Any<SettlementId>(), Arg.Any<CancellationToken>())
            .Returns([]);

        settlementUserRepository
            .GetBySettlementId(Arg.Any<SettlementId>(), Arg.Any<CancellationToken>())
            .Returns((SettlementUser?)null);

        var response = await handler.Handle(query, default);

        response.IsSuccess.Should().BeTrue();
        response.Value.Settlements.Should().HaveCount(2);

        var firstSettlement = settlements[0];
        response.Value.Settlements.First().Id.Should().Be(firstSettlement.Id.Value);
        response.Value.Settlements.First().Name.Should().Be(firstSettlement.Name);
    }
}
