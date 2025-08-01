using ExpenseSplitter.Api.Application.Abstractions.Authentication;
using ExpenseSplitter.Api.Application.Settlements.LeaveSettlement;
using ExpenseSplitter.Api.Domain.Abstractions;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;
using ExpenseSplitter.Api.Domain.Users;

namespace ExpenseSplitter.Api.Application.UnitTests.Settlements;

public class LeaveSettlementCommandHandlerTests
{
    private readonly Fixture fixture = CustomFixture.Create();
    private readonly ISettlementUserRepository settlementUserRepository = Substitute.For<ISettlementUserRepository>();
    private readonly ISettlementRepository settlementRepository = Substitute.For<ISettlementRepository>();
    private readonly IUserContext userContext = Substitute.For<IUserContext>();
    private readonly IUnitOfWork unitOfWorkMock = Substitute.For<IUnitOfWork>();
    private readonly LeaveSettlementCommandHandler handler;

    public LeaveSettlementCommandHandlerTests()
    {
        settlementUserRepository
            .GetBySettlementId(Arg.Any<SettlementId>(), Arg.Any<CancellationToken>())
            .Returns(fixture.Create<SettlementUser>());

        handler = new LeaveSettlementCommandHandler(
            settlementUserRepository,
            settlementRepository,
            userContext,
            unitOfWorkMock
        );
    }

    [Fact]
    public async Task Validate_ShouldFail_WhenSettlementIdIsEmpty()
    {
        var command = fixture
            .Build<LeaveSettlementCommand>()
            .With(x => x.SettlemetId, Guid.Empty)
            .Create();

        var validator = new LeaveSettlementCommandValidator();
        var result = await validator.ValidateAsync(command);

        result.Errors.Should().Contain(x => x.PropertyName == nameof(command.SettlemetId));
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenSettlementWithInviteCodeDoesNotExist()
    {
        var settlement = fixture.Create<Settlement>();
        settlementRepository
            .GetById(Arg.Any<SettlementId>(), Arg.Any<CancellationToken>())
            .Returns(settlement);
        
        settlementUserRepository
            .GetBySettlementId(Arg.Any<SettlementId>(), Arg.Any<CancellationToken>())
            .Returns((SettlementUser) default);

        var command = fixture.Create<LeaveSettlementCommand>();

        var response = await handler.Handle(command, default);

        response.IsFailure.Should().BeTrue();
        response.AppError.Type.Should().Be(SettlementErrors.Forbidden.Type);
    }

    [Fact]
    public async Task Handle_ShouldSuccess()
    {
        var creatorUserId = new UserId(fixture.Create<Guid>());
        var currentUserId = new UserId(fixture.Create<Guid>());
        
        var settlementResult = Settlement.Create(
            fixture.Create<string>(),
            fixture.Create<string>(),
            creatorUserId,
            fixture.Create<DateTime>()
        );
        var settlement = settlementResult.Value;
            
        settlementRepository
            .GetById(Arg.Any<SettlementId>(), Arg.Any<CancellationToken>())
            .Returns(settlement);
            
        userContext.UserId.Returns(currentUserId);

        var command = fixture.Create<LeaveSettlementCommand>();

        var response = await handler.Handle(command, default);

        response.IsSuccess.Should().BeTrue();
    }
}
