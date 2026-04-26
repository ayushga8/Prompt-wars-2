import { describe, it, expect } from 'vitest';
import modules from '../data/modules';

describe('Modules Data', () => {
  it('contains the correct number of modules', () => {
    expect(modules).toHaveLength(6);
  });

  it('has an overview module as the first entry', () => {
    expect(modules[0].id).toBe('overview');
    expect(modules[0].badgeIcon).toBeNull();
    expect(modules[0].quiz).toHaveLength(0);
  });

  it('all non-overview modules have quizzes', () => {
    const learningModules = modules.filter(m => m.id !== 'overview');
    learningModules.forEach(mod => {
      expect(mod.quiz.length).toBeGreaterThan(0);
      expect(mod.badgeIcon).toBeTruthy();
      expect(mod.badgeLabel).toBeTruthy();
    });
  });

  it('all quiz questions have exactly 4 options and a valid correctIndex', () => {
    modules.forEach(mod => {
      mod.quiz.forEach(q => {
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
      });
    });
  });

  it('all modules have required fields', () => {
    modules.forEach(mod => {
      expect(mod.id).toBeDefined();
      expect(mod.title).toBeDefined();
      expect(mod.icon).toBeDefined();
      expect(mod.explanation).toBeDefined();
      expect(mod.timelineSteps).toBeDefined();
      expect(mod.timelineSteps.length).toBeGreaterThan(0);
    });
  });

  it('each timeline step has a title and description', () => {
    modules.forEach(mod => {
      mod.timelineSteps.forEach(step => {
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
      });
    });
  });
});
