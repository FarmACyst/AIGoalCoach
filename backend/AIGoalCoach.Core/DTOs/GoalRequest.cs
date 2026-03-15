using AIGoalCoach.Core.Constants;
using FluentValidation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace AIGoalCoach.Core.DTOs
{
    public class GoalRequest
    {
        [Required]
        [MaxLength(GoalConstants.MaxLength)]
        [Description("A short description of the user's goal to refine.")]
        public string UserGoal { get; set; } = string.Empty;
    }

    public class GoalRequestValidator : AbstractValidator<GoalRequest>
    {
        public GoalRequestValidator()
        {
            RuleFor(x => x.UserGoal)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage(ErrorMessages.Empty)
                .MaximumLength(GoalConstants.MaxLength).WithMessage(ErrorMessages.LengthExceeded)
                .WithName("Goal");
        }
    }
    
}
