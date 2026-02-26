import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Button from '../Button.vue';

describe('Button component', () => {
 
  test('renders slot content', () => {
    render(Button, {
      props: { type: 'button' },
      slots: { default: 'Click me' },
    });

    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('Click me');
  });

 
  test('applies custom type', () => {
    render(Button, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    });

    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
  });

  test('applies primary variant classes', () => {
    render(Button, {
      props: { type: 'button', variant: 'primary' },
      slots: { default: 'Primary' },
    });

    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-pink-700');
  });

  test('applies disabled classes and attributes', () => {
    render(Button, {
      props: { type: 'button', disabled: true },
      slots: { default: 'Disabled' },
    });

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('cursor-not-allowed');
  });

 
  test('emits click event when enabled', async () => {
    const user = userEvent.setup();
    const { emitted } = render(Button, {
      props: { type: 'button' },
      slots: { default: 'Click me' },
    });

    const btn = screen.getByRole('button');
    await user.click(btn);

    expect(emitted().click).toHaveLength(1);
  });

  test('does not emit click event when disabled', async () => {
    const user = userEvent.setup();
    const { emitted } = render(Button, {
      props: { type: 'button', disabled: true },
      slots: { default: 'Click me' },
    });

    const btn = screen.getByRole('button');
    await user.click(btn);

    expect(emitted().click).toBeUndefined();
  });
});
